import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { getCurrentUserOrThrow } from "../auth";

type Role = "owner" | "admin" | "member" | "viewer";

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export async function requireOrgAccess(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">,
  minimumRole: Role = "viewer"
) {
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

  if (ROLE_HIERARCHY[membership.role] < ROLE_HIERARCHY[minimumRole]) {
    throw new Error(`Access denied: Requires ${minimumRole} role or higher`);
  }

  return { user, membership };
}

export async function getUserOrganizations(ctx: QueryCtx | MutationCtx) {
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

  return organizations.filter((o): o is NonNullable<typeof o> => o !== null);
}
