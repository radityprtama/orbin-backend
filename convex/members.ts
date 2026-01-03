import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./auth";

export const listByOrganization = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, { organizationId }) {
    const user = await getCurrentUserOrThrow(ctx);

    const userMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", organizationId).eq("userId", user._id)
      )
      .unique();

    if (!userMembership) {
      throw new Error("Access denied: Not a member of this organization");
    }

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    const membersWithUsers = await Promise.all(
      memberships.map(async (m) => {
        const memberUser = await ctx.db.get(m.userId);
        return memberUser
          ? {
              _id: m._id,
              role: m.role,
              joinedAt: m.joinedAt,
              user: {
                _id: memberUser._id,
                name: memberUser.name,
                email: memberUser.email,
                avatarUrl: memberUser.avatarUrl,
              },
            }
          : null;
      })
    );

    return membersWithUsers.filter(Boolean);
  },
});

export const updateRole = mutation({
  args: {
    memberId: v.id("organizationMembers"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
  },
  async handler(ctx, { memberId, role }) {
    const user = await getCurrentUserOrThrow(ctx);

    const targetMembership = await ctx.db.get(memberId);
    if (!targetMembership) {
      throw new Error("Member not found");
    }

    const userMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", targetMembership.organizationId).eq("userId", user._id)
      )
      .unique();

    if (!userMembership || !["owner", "admin"].includes(userMembership.role)) {
      throw new Error("Access denied: Requires admin role or higher");
    }

    if (targetMembership.role === "owner") {
      throw new Error("Cannot change owner role");
    }

    await ctx.db.patch(memberId, { role });
    return { success: true };
  },
});

export const remove = mutation({
  args: { memberId: v.id("organizationMembers") },
  async handler(ctx, { memberId }) {
    const user = await getCurrentUserOrThrow(ctx);

    const targetMembership = await ctx.db.get(memberId);
    if (!targetMembership) {
      throw new Error("Member not found");
    }

    const userMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", targetMembership.organizationId).eq("userId", user._id)
      )
      .unique();

    const isSelf = targetMembership.userId === user._id;
    const isAdminOrOwner = userMembership && ["owner", "admin"].includes(userMembership.role);

    if (!isSelf && !isAdminOrOwner) {
      throw new Error("Access denied");
    }

    if (targetMembership.role === "owner") {
      throw new Error("Cannot remove owner");
    }

    await ctx.db.delete(memberId);
    return { success: true };
  },
});
