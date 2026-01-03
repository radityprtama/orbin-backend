import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./auth";

const INVITATION_EXPIRY_DAYS = 7;

export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  },
  async handler(ctx, { organizationId, email, role }) {
    const user = await getCurrentUserOrThrow(ctx);

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id)
      )
      .unique();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Access denied: Requires admin role or higher");
    }

    const existingInvite = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existingInvite) {
      throw new Error("Pending invitation already exists for this email");
    }

    const existingMember = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existingMember) {
      const alreadyMember = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org_user", (q) =>
          q.eq("organizationId", organizationId).eq("userId", existingMember._id)
        )
        .unique();

      if (alreadyMember) {
        throw new Error("User is already a member of this organization");
      }
    }

    const token = crypto.randomUUID();
    const now = Date.now();
    const expiresAt = now + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    const invitationId = await ctx.db.insert("invitations", {
      organizationId,
      email,
      role,
      invitedBy: user._id,
      token,
      expiresAt,
      status: "pending",
      createdAt: now,
    });

    return { invitationId, token };
  },
});

export const listByOrganization = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, { organizationId }) {
    const user = await getCurrentUserOrThrow(ctx);

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id)
      )
      .unique();

    if (!membership) {
      throw new Error("Access denied: Not a member of this organization");
    }

    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return invitations;
  },
});

export const getByToken = query({
  args: { token: v.string() },
  async handler(ctx, { token }) {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!invitation) {
      return null;
    }

    const org = await ctx.db.get(invitation.organizationId);
    const inviter = invitation.invitedBy ? await ctx.db.get(invitation.invitedBy) : null;

    return {
      ...invitation,
      organization: org,
      inviter: inviter ? { name: inviter.name, email: inviter.email } : null,
    };
  },
});

export const accept = mutation({
  args: { token: v.string() },
  async handler(ctx, { token }) {
    const user = await getCurrentUserOrThrow(ctx);

    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitation._id, { status: "expired" });
      throw new Error("Invitation has expired");
    }

    if (invitation.email !== user.email) {
      throw new Error("This invitation was sent to a different email address");
    }

    const existingMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", invitation.organizationId).eq("userId", user._id)
      )
      .unique();

    if (existingMembership) {
      await ctx.db.patch(invitation._id, { status: "accepted" });
      return { organizationId: invitation.organizationId };
    }

    await ctx.db.insert("organizationMembers", {
      organizationId: invitation.organizationId,
      userId: user._id,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
      joinedAt: Date.now(),
    });

    await ctx.db.patch(invitation._id, { status: "accepted" });

    return { organizationId: invitation.organizationId };
  },
});

export const revoke = mutation({
  args: { invitationId: v.id("invitations") },
  async handler(ctx, { invitationId }) {
    const user = await getCurrentUserOrThrow(ctx);

    const invitation = await ctx.db.get(invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", invitation.organizationId).eq("userId", user._id)
      )
      .unique();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Access denied: Requires admin role or higher");
    }

    await ctx.db.delete(invitationId);
    return { success: true };
  },
});
