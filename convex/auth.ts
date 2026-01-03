import { internalMutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = internalMutation({
  args: {
    data: v.object({
      id: v.string(),
      first_name: v.optional(v.union(v.string(), v.null())),
      last_name: v.optional(v.union(v.string(), v.null())),
      email_addresses: v.array(
        v.object({
          email_address: v.string(),
        })
      ),
      image_url: v.optional(v.string()),
    }),
  },
  async handler(ctx, { data }) {
    const firstName = data.first_name ?? "";
    const lastName = data.last_name ?? "";
    const name = `${firstName} ${lastName}`.trim() || "User";
    const email = data.email_addresses[0]?.email_address ?? "";

    const userAttributes = {
      name,
      email,
      externalId: data.id,
      avatarUrl: data.image_url,
      updatedAt: Date.now(),
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", {
        ...userAttributes,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    }
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await userByExternalId(ctx, identity.subject);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return user;
}

async function userByExternalId(ctx: QueryCtx | MutationCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
    .unique();
}
