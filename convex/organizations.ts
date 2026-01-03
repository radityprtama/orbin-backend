import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./auth";

const DEFAULT_RETRY_POLICY = {
  maxAttempts: 3,
  backoffCoefficient: 2,
  initialInterval: 1000,
  maxInterval: 60000,
};

const PLAN_LIMITS: Record<string, number> = {
  free: 1000,
  pro: 10000,
  business: 100000,
  enterprise: 1000000,
};

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  async handler(ctx, { name, slug }) {
    const user = await getCurrentUserOrThrow(ctx);

    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new Error("Organization slug already taken");
    }

    const now = Date.now();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);

    const orgId = await ctx.db.insert("organizations", {
      name,
      slug,
      plan: "free",
      usageLimitExecutions: PLAN_LIMITS.free,
      usageCurrentExecutions: 0,
      usageResetAt: nextMonth.getTime(),
      settings: {
        defaultRetryPolicy: DEFAULT_RETRY_POLICY,
        alertEmails: [user.email],
      },
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("organizationMembers", {
      organizationId: orgId,
      userId: user._id,
      role: "owner",
      joinedAt: now,
    });

    return orgId;
  },
});

export const get = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, { organizationId }) {
    return await ctx.db.get(organizationId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  async handler(ctx, { slug }) {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const listForUser = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUserOrThrow(ctx);

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const organizations = await Promise.all(
      memberships.map(async (m) => {
        const org = await ctx.db.get(m.organizationId);
        return org ? { ...org, role: m.role } : null;
      })
    );

    return organizations.filter(Boolean);
  },
});

export const update = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    settings: v.optional(
      v.object({
        defaultRetryPolicy: v.optional(
          v.object({
            maxAttempts: v.number(),
            backoffCoefficient: v.number(),
            initialInterval: v.number(),
            maxInterval: v.number(),
          })
        ),
        webhookSecret: v.optional(v.string()),
        alertEmails: v.optional(v.array(v.string())),
      })
    ),
  },
  async handler(ctx, { organizationId, ...updates }) {
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

    const org = await ctx.db.get(organizationId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const updateData: Record<string, unknown> = { updatedAt: Date.now() };

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    if (updates.billingEmail !== undefined) {
      updateData.billingEmail = updates.billingEmail;
    }

    if (updates.settings !== undefined) {
      updateData.settings = {
        ...org.settings,
        ...updates.settings,
        defaultRetryPolicy: updates.settings.defaultRetryPolicy
          ? { ...org.settings.defaultRetryPolicy, ...updates.settings.defaultRetryPolicy }
          : org.settings.defaultRetryPolicy,
        alertEmails: updates.settings.alertEmails ?? org.settings.alertEmails,
      };
    }

    await ctx.db.patch(organizationId, updateData);
    return { success: true };
  },
});

export const generateWebhookSecret = mutation({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, { organizationId }) {
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

    const org = await ctx.db.get(organizationId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const secret = `whsec_${crypto.randomUUID().replace(/-/g, "")}`;

    await ctx.db.patch(organizationId, {
      settings: {
        ...org.settings,
        webhookSecret: secret,
      },
      updatedAt: Date.now(),
    });

    return { secret };
  },
});
