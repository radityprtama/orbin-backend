import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./auth";

export const current = query({
  args: {},
  async handler(ctx) {
    return await getCurrentUser(ctx);
  },
});

export const get = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    return await ctx.db.get(userId);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  async handler(ctx, { email }) {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const hasAnyOrganization = query({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUserOrThrow(ctx);

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return membership !== null;
  },
});
