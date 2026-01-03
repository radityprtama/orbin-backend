# ORBIN DASHBOARD - PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-03
**Stack:** Next.js 16.1.1 + React 19 + Convex + Clerk + Tailwind v4 + shadcn/ui

## OVERVIEW

Event-driven workflow orchestration platform. Multi-tenant SaaS with real-time dashboard, RBAC, and Stripe billing.

## STRUCTURE

```
orbin-app/
├── app/
│   ├── (auth)/           # Clerk sign-in/up, invite accept
│   ├── (dashboard)/      # Protected routes, [orgSlug] scoping
│   │   └── onboarding/   # New org creation flow
│   └── api/webhooks/     # Clerk, Stripe, event ingestion
├── convex/               # Backend: schema, queries, mutations, RBAC
├── components/
│   ├── ui/               # shadcn primitives (DO NOT modify directly)
│   ├── layout/           # Sidebar, nav, org-switcher, breadcrumbs
│   ├── shared/           # StatusBadge, CopyButton, EmptyState
│   └── dashboard/        # OverviewCards, ActivityFeed
├── providers/            # ConvexClerkProvider, ThemeProvider
├── lib/                  # utils.ts (cn), types.ts, constants.ts
├── hooks/                # use-organization, use-debounce
└── TODO/                 # Phase-structured implementation plans
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add Convex function | `convex/*.ts` | Follow existing query/mutation pattern |
| Add dashboard page | `app/(dashboard)/[orgSlug]/` | Use layout hierarchy |
| Add shadcn component | Run `npx shadcn@latest add <name>` | Goes to `components/ui/` |
| Add shared component | `components/shared/` | Named exports + barrel file |
| Check implementation plan | `TODO/TODO-phase-*.md` | Mark `[x]` when done |
| RBAC check | `convex/lib/permissions.ts` | `requireOrgAccess(ctx, orgId, role)` |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `schema` | const | `convex/schema.ts` | 12 tables: orgs, users, workflows, runs, events |
| `requireOrgAccess` | function | `convex/lib/permissions.ts` | RBAC gate: owner(4)>admin(3)>member(2)>viewer(1) |
| `getCurrentUserOrThrow` | function | `convex/auth.ts` | Get authenticated user from Clerk identity |
| `ConvexClerkProvider` | component | `providers/convex-provider.tsx` | Auth + realtime wrapper |
| `Organization` | type | `lib/types.ts` | Core domain types |

## CONVENTIONS

**This project deviates from standard:**

- **Flat root**: No `src/` directory—all top-level
- **Route groups**: `(auth)` public, `(dashboard)` protected with `[orgSlug]`
- **Providers isolated**: Separate `providers/` not in `lib/`
- **TODO-driven**: Complex tasks require `TODO/TODO-*.md` before implementation
- **Multi-tenant scoping**: All Convex functions require `organizationId`

**File headers required:**
```typescript
/**
 * File: [filename]
 * Created by: Raditya Pratama (hi@pratama.dev)
 * Date: [current date]
 * Purpose: [brief description]
 * Part of: Orbin
 */
```

## ANTI-PATTERNS

- **NEVER** modify `components/ui/` directly—regenerate via shadcn CLI
- **NEVER** bypass RBAC—always use `requireOrgAccess()` in Convex functions
- **NEVER** expose Convex internal functions to client—use `internalMutation`/`internalQuery`
- **NEVER** skip TODO file for multi-step features
- **NEVER** use `any` type—full TypeScript strictness

## COMMANDS

```bash
npm run dev          # Next.js dev server
npx convex dev       # Convex backend + type generation
npx shadcn@latest add <component>  # Add shadcn component
```

## NOTES

- **Clerk webhook**: Must configure `/api/webhooks/clerk` endpoint in Clerk dashboard
- **Convex types**: Run `npx convex dev` to generate `convex/_generated/`
- **Tailwind v4**: Uses new `@tailwindcss/postcss` plugin, not legacy config
- **Next.js 16**: Bleeding edge—middleware uses `auth.protect()` pattern
