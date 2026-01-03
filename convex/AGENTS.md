# CONVEX BACKEND - AGENTS.md

## OVERVIEW

Real-time backend with multi-tenant RBAC, Clerk auth sync, 12-table schema.

## STRUCTURE

```
convex/
├── schema.ts           # 12 tables with indexes
├── auth.ts             # Clerk webhook handlers + getCurrentUser
├── organizations.ts    # Org CRUD + settings
├── users.ts            # User queries
├── members.ts          # Membership management
├── invitations.ts      # Invite flow with tokens
└── lib/
    ├── permissions.ts  # RBAC: requireOrgAccess()
    └── utils.ts        # generateToken, slugify
```

## WHERE TO LOOK

| Task | File | Pattern |
|------|------|---------|
| Add new table | `schema.ts` | defineTable + indexes |
| Add query | `*.ts` | `export const x = query({...})` |
| Add mutation | `*.ts` | `export const x = mutation({...})` |
| Internal-only function | `*.ts` | `internalMutation` / `internalQuery` |
| Permission check | `lib/permissions.ts` | `requireOrgAccess(ctx, orgId, "member")` |

## CONVENTIONS

**Role hierarchy (NEVER bypass):**
```
owner (4) > admin (3) > member (2) > viewer (1)
```

**Every function pattern:**
```typescript
export const myFunction = query({
  args: { organizationId: v.id("organizations"), ... },
  handler: async (ctx, args) => {
    await requireOrgAccess(ctx, args.organizationId, "viewer");
    // ... logic
  },
});
```

**Multi-tenant scoping:** All tables have `organizationId` field + index.

**Timestamps:** Use `Date.now()` for `createdAt`, `updatedAt`.

## ANTI-PATTERNS

- **NEVER** query without org scoping—data isolation is critical
- **NEVER** expose internal functions—prefix with `internal.`
- **NEVER** return user data without auth check
- **NEVER** use `v.any()` for known structures—define explicit validators

## NOTES

- Run `npx convex dev` to sync schema and generate types
- Clerk user sync via `auth.ts` internal mutations
- `_generated/` is auto-created—never edit
