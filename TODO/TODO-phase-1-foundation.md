# TODO: Phase 1 - Foundation

**Created by:** AI Assistant  
**Date:** January 3, 2025  
**Purpose:** Establish core infrastructure with authentication, organization management, and team collaboration features

## 📋 Task Breakdown

### Phase 1.1: Project Setup

- [x] Initialize Next.js 15 with App Router
- [x] Configure Tailwind CSS v4
- [x] Setup shadcn/ui component library
- [x] Install and configure Convex
- [x] Setup TypeScript configuration
- [x] Configure ESLint and Prettier

### Phase 1.2: Convex Backend Setup

- [x] Create Convex schema.ts with all tables (organizations, users, organizationMembers, invitations, apiKeys, workflows, workflowRuns, stepExecutions, events, integrations, auditLogs, notifications, artifacts)
- [x] Implement auth.ts with Clerk webhook handlers
- [x] Create lib/permissions.ts for RBAC (owner > admin > member > viewer)
- [x] Create lib/utils.ts for common utilities
- [x] Create organizations.ts mutations/queries (create, get, list, update, getBySlug)
- [x] Create users.ts queries (getById, getByEmail, getCurrentUser)
- [x] Create members.ts for membership management (add, remove, updateRole, list)
- [x] Create invitations.ts for invite flow (create, accept, list, revoke)

### Phase 1.3: Authentication Integration

- [x] Install @clerk/nextjs and configure
- [x] Create ConvexClerkProvider in providers/convex-provider.tsx
- [x] Update root layout with ConvexClerkProvider
- [x] Create middleware.ts for route protection
- [x] Setup Clerk webhook handler at /api/webhooks/clerk

### Phase 1.4: Auth Pages

- [x] Create (auth) route group with centered layout
- [x] Create sign-in page with Clerk SignIn component
- [x] Create sign-up page with Clerk SignUp component
- [x] Create accept-invite/[token] page for invitation acceptance

### Phase 1.5: Onboarding Flow

- [x] Create onboarding page for new organization creation
- [ ] Implement organization creation form with validation
- [ ] Add slug generation from organization name
- [ ] Redirect to dashboard after org creation

### Phase 1.6: Dashboard Layout

- [ ] Create (dashboard) route group
- [ ] Create dashboard layout.tsx with sidebar
- [ ] Create [orgSlug] dynamic route layout
- [ ] Implement app-sidebar.tsx component
- [ ] Implement sidebar-nav.tsx with navigation items
- [ ] Implement user-nav.tsx dropdown
- [ ] Implement org-switcher.tsx component
- [ ] Implement breadcrumbs.tsx component

### Phase 1.7: Organization Settings

- [ ] Create settings layout with sub-navigation
- [ ] Create general settings page (name, slug, billing email)
- [ ] Create members page with member table
- [ ] Implement invite-modal.tsx for sending invitations
- [ ] Add role management (change role, remove member)
- [ ] Add pending invitations list with resend/revoke

## 🎯 Expected Outcomes

- [ ] Users can sign up and sign in via Clerk
- [ ] New users are redirected to onboarding to create organization
- [ ] Organizations can be created with name and slug
- [ ] Team members can be invited via email
- [ ] Invitations can be accepted to join organization
- [ ] RBAC enforces permission levels (owner, admin, member, viewer)
- [ ] Dashboard layout renders with sidebar navigation
- [ ] Organization settings are fully functional

## ⚠️ Risks & Considerations

- Clerk webhook must be configured in Clerk dashboard pointing to /api/webhooks/clerk
- Convex requires `npx convex dev` to be running for development
- Environment variables must be set for Clerk and Convex
- Slug uniqueness must be enforced at database level

## 🔄 Dependencies

- Clerk account and API keys
- Convex project created
- Node.js 18+ installed
- Environment variables configured (.env.local)
