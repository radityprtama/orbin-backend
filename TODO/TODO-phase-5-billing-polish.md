# TODO: Phase 5 - Billing & Polish

**Created by:** AI Assistant  
**Date:** January 3, 2025  
**Purpose:** Implement usage-based billing with Stripe, API key management, audit logs, and production-ready polish

## 📋 Task Breakdown

### Phase 5.1: Stripe Integration

- [ ] Install stripe package
- [ ] Create lib/stripe.ts (Stripe client)
- [ ] Create app/api/webhooks/stripe/route.ts
  - [ ] Verify webhook signature
  - [ ] Handle subscription.created
  - [ ] Handle subscription.updated
  - [ ] Handle subscription.deleted
  - [ ] Handle invoice.payment_succeeded
  - [ ] Handle invoice.payment_failed
- [ ] Create convex/billing.ts
  - [ ] syncSubscription internal mutation
  - [ ] cancelSubscription internal mutation
  - [ ] recordPayment internal mutation
  - [ ] getUsage query
  - [ ] incrementUsage mutation

### Phase 5.2: Usage Tracking

- [ ] Add usageCurrentExecutions counter to organizations
- [ ] Increment counter on workflow execution
- [ ] Create monthly reset cron job (convex/crons.ts)
- [ ] Add usage limit enforcement before execution
- [ ] Send usage threshold notifications (70%, 90%, 100%)

### Phase 5.3: Billing UI

- [ ] Create settings/billing/page.tsx
- [ ] Implement billing-card.tsx
  - [ ] Current plan display
  - [ ] Usage gauge (current/limit)
  - [ ] Period countdown
- [ ] Implement usage-gauge.tsx (visual meter)
- [ ] Add upgrade/downgrade buttons
- [ ] Create Stripe Customer Portal link
- [ ] Display invoice history

### Phase 5.4: API Key Management

- [ ] Create convex/apiKeys.ts
  - [ ] create mutation (generate key, store hash)
  - [ ] list query (by organization)
  - [ ] revoke mutation
  - [ ] validate query (for API requests)
- [ ] Create api-keys/page.tsx
- [ ] Implement api-key-table.tsx
  - [ ] Columns: Name, Type, Masked Key, Last Used, Created By, Actions
  - [ ] Revoke action with confirmation
- [ ] Implement create-key-modal.tsx
  - [ ] Name input
  - [ ] Type select (Publishable, Secret, Restricted)
  - [ ] Permissions checkboxes (for restricted)
  - [ ] Expiration date (optional)
- [ ] Implement key-display.tsx
  - [ ] Reveal-once pattern
  - [ ] Copy button
  - [ ] Security warning

### Phase 5.5: Audit Logs

- [ ] Create convex/auditLogs.ts
  - [ ] log mutation (internal)
  - [ ] list query (with filters)
  - [ ] getById query
- [ ] Add audit logging to all mutations:
  - [ ] workflow.created, workflow.updated, workflow.deleted
  - [ ] member.invited, member.removed, member.roleChanged
  - [ ] apiKey.created, apiKey.revoked
  - [ ] integration.connected, integration.disconnected
  - [ ] settings.updated
- [ ] Create settings/audit-log/page.tsx
- [ ] Implement audit-log-table.tsx
  - [ ] Columns: Timestamp, Actor, Action, Resource, IP, Details
  - [ ] Expandable details row
  - [ ] Filter by actor, action, date range
- [ ] Add CSV export functionality

### Phase 5.6: Notifications System

- [ ] Create convex/notifications.ts
  - [ ] create mutation
  - [ ] list query (by user)
  - [ ] markRead mutation
  - [ ] markAllRead mutation
  - [ ] delete mutation
- [ ] Implement notifications.tsx (bell icon + panel)
  - [ ] Unread count badge
  - [ ] Dropdown notification list
  - [ ] Mark as read (individual/all)
  - [ ] Link to relevant resource
- [ ] Create notification types:
  - [ ] workflow_failed
  - [ ] usage_threshold
  - [ ] member_joined
  - [ ] integration_error
  - [ ] system

### Phase 5.7: Command Palette

- [ ] Install cmdk package
- [ ] Implement command-menu.tsx
  - [ ] Cmd+K trigger
  - [ ] Navigation section (pages)
  - [ ] Recent section (recently viewed)
  - [ ] Actions section (create workflow, etc.)
  - [ ] Fuzzy search
- [ ] Add keyboard shortcut hints
- [ ] Add recent items tracking

### Phase 5.8: Dark Mode

- [ ] Ensure theme-provider.tsx supports dark mode
- [ ] Add theme toggle to user dropdown
- [ ] Verify all components support dark mode
- [ ] Test color contrast in dark mode
- [ ] Add system preference detection

### Phase 5.9: Performance Optimization

- [ ] Implement loading skeletons for all pages
- [ ] Add suspense boundaries
- [ ] Lazy load Monaco Editor
- [ ] Optimize bundle size (analyze with next/bundle-analyzer)
- [ ] Add caching headers for static assets
- [ ] Implement pagination for large lists

### Phase 5.10: Error Handling & Edge Cases

- [ ] Create global error boundary (app/error.tsx)
- [ ] Create not-found page (app/not-found.tsx)
- [ ] Create loading page (app/loading.tsx)
- [ ] Add toast notifications for errors
- [ ] Handle network disconnection gracefully
- [ ] Add retry logic for failed API calls

## 🎯 Expected Outcomes

- [ ] Users can subscribe to paid plans via Stripe
- [ ] Usage is tracked and limits enforced
- [ ] Billing portal accessible for payment management
- [ ] API keys can be created, viewed, and revoked
- [ ] All actions are logged in audit trail
- [ ] Users receive in-app notifications
- [ ] Command palette enables quick navigation
- [ ] Dark mode is fully functional
- [ ] App performs well with large datasets

## ⚠️ Risks & Considerations

- Stripe webhooks must be configured in Stripe Dashboard
- Usage tracking must be atomic to prevent race conditions
- Audit logs can grow large - implement retention policy
- API key exposure is a security risk - use reveal-once pattern
- Dark mode requires testing all components

## 🔄 Dependencies

- Phases 1-4 complete
- Stripe account with products/prices configured
- Stripe webhook endpoint configured
- cmdk package installed
