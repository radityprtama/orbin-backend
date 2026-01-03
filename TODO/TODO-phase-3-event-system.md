# TODO: Phase 3 - Event System

**Created by:** AI Assistant  
**Date:** January 3, 2025  
**Purpose:** Implement event bus for receiving, processing, and triggering workflows from external events

## 📋 Task Breakdown

### Phase 3.1: Webhook Ingestion Endpoint

- [ ] Install @upstash/ratelimit and @upstash/redis
- [ ] Create app/api/webhooks/ingest/route.ts
  - [ ] Rate limiting with Upstash (100 req/min per IP)
  - [ ] API key validation from headers (x-api-key)
  - [ ] Idempotency key support (x-idempotency-key)
  - [ ] Request body parsing and validation
  - [ ] Event persistence to Convex
- [ ] Add rate limit headers to response (X-RateLimit-*)
- [ ] Add proper error responses (401, 429, 500)

### Phase 3.2: Convex Events Backend

- [ ] Create convex/events.ts
  - [ ] ingest mutation (validate API key, store event)
  - [ ] list query (with filters)
  - [ ] getById query
  - [ ] updateStatus mutation
  - [ ] replay mutation (re-trigger processing)
  - [ ] markProcessed mutation
  - [ ] markFailed mutation
- [ ] Create convex/lib/apiKeyValidator.ts
  - [ ] Hash API key and lookup
  - [ ] Update lastUsedAt on validation
- [ ] Add event deduplication by eventId

### Phase 3.3: Event → Workflow Trigger

- [ ] Create convex/lib/eventMatcher.ts
  - [ ] Match events to workflow triggers by eventType
  - [ ] Support wildcard patterns (order.* matches order.created)
- [ ] Create convex/actions/processEvent.ts
  - [ ] Find matching workflows
  - [ ] Create workflowRun for each match
  - [ ] Queue execution via QStash (optional)
- [ ] Add event trigger configuration to workflow editor
- [ ] Implement event payload transformation/mapping

### Phase 3.4: Event Stream UI

- [ ] Create events/page.tsx
- [ ] Implement event-stream.tsx (real-time list)
  - [ ] Columns: Event Type, Source, Status, Payload Preview, Received At, Actions
  - [ ] Real-time updates via Convex subscription
  - [ ] Auto-scroll for new events (optional toggle)
- [ ] Implement event-filters.tsx
  - [ ] Filter by event type
  - [ ] Filter by source
  - [ ] Filter by status (Pending, Processed, Failed)
  - [ ] Date range filter
- [ ] Add search by event ID

### Phase 3.5: Event Detail View

- [ ] Create events/[eventId]/page.tsx
- [ ] Implement event-detail.tsx
  - [ ] Full payload JSON viewer
  - [ ] Event metadata (type, source, timestamp)
  - [ ] Processing status and timestamp
  - [ ] Related workflow runs list
- [ ] Add Replay button (re-process event)
- [ ] Add Copy buttons for ID and payload

### Phase 3.6: Dead Letter Queue

- [ ] Create DLQ view for failed events
- [ ] Add retry mechanism for failed events
- [ ] Add bulk retry functionality
- [ ] Add ability to manually mark as processed
- [ ] Add delete functionality for dead letters

### Phase 3.7: Event Monitoring

- [ ] Add event count metrics to dashboard
- [ ] Add event processing latency tracking
- [ ] Add failed event alerts
- [ ] Create event type analytics

## 🎯 Expected Outcomes

- [ ] External systems can send events via webhook
- [ ] Events are stored with full payload
- [ ] Events automatically trigger matching workflows
- [ ] Event stream shows real-time event flow
- [ ] Failed events are captured in dead letter queue
- [ ] Events can be replayed for debugging/recovery

## ⚠️ Risks & Considerations

- Rate limiting is essential to prevent abuse
- API key validation must be secure (use hashed comparison)
- Large payloads may need size limits (1MB recommended)
- Event processing must be idempotent
- DLQ can grow large - implement retention policy

## 🔄 Dependencies

- Phase 1 complete (auth, API keys)
- Phase 2 complete (workflows, execution)
- Upstash Redis account configured
- API keys table populated
