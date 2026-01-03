# TODO: Phase 2 - Workflow Core

**Created by:** AI Assistant  
**Date:** January 3, 2025  
**Purpose:** Implement workflow creation, editing, and execution with real-time status updates

## 📋 Task Breakdown

### Phase 2.1: Convex Workflow Backend

- [ ] Create convex/workflows.ts with CRUD operations
  - [ ] create mutation (with validation)
  - [ ] get query
  - [ ] list query (with filters: status, trigger type)
  - [ ] update mutation
  - [ ] updateStatus mutation (active/paused)
  - [ ] duplicate mutation
  - [ ] archive mutation
  - [ ] delete mutation
- [ ] Create convex/workflowRuns.ts
  - [ ] create mutation (start execution)
  - [ ] updateStatus mutation
  - [ ] listByOrganization query (real-time)
  - [ ] listByWorkflow query
  - [ ] getWithSteps query (run + steps)
  - [ ] cancel mutation
  - [ ] replay mutation
- [ ] Create convex/stepExecutions.ts
  - [ ] create mutation
  - [ ] updateStatus mutation
  - [ ] listByRun query

### Phase 2.2: Workflow List UI

- [ ] Create workflows/page.tsx (list view)
- [ ] Implement workflow-table.tsx with TanStack Table
  - [ ] Columns: Name, Status, Trigger Type, Last Run, Executions (7d), Actions
  - [ ] Sorting by all columns
  - [ ] Filtering by status and trigger type
  - [ ] Pagination
- [ ] Create status-badge.tsx component (Active, Paused, Draft, Archived)
- [ ] Add quick actions dropdown (Edit, Pause/Resume, Duplicate, Delete)
- [ ] Add empty state component
- [ ] Add loading skeleton

### Phase 2.3: Workflow Editor

- [ ] Install @monaco-editor/react
- [ ] Create workflows/new/page.tsx
- [ ] Create workflows/[workflowId]/page.tsx (editor)
- [ ] Implement workflow-editor.tsx with Monaco Editor
  - [ ] TypeScript syntax highlighting
  - [ ] Auto-completion for workflow DSL
  - [ ] Error highlighting
- [ ] Implement workflow-form.tsx for metadata
  - [ ] Name input
  - [ ] Description textarea
  - [ ] Status select
- [ ] Implement trigger-config.tsx
  - [ ] Webhook trigger config
  - [ ] Schedule trigger config (cron expression)
  - [ ] Manual trigger config
  - [ ] Event trigger config
- [ ] Implement workflow-preview.tsx (visual step representation)
- [ ] Add editor tabs (Code, Trigger, Steps, Settings, History)

### Phase 2.4: Workflow Execution Engine

- [ ] Create convex/lib/executor.ts
  - [ ] Step execution logic
  - [ ] Retry handling with exponential backoff
  - [ ] Timeout handling
  - [ ] Error capture and formatting
- [ ] Create convex/actions/executeWorkflow.ts (Convex action)
- [ ] Implement step types:
  - [ ] action step (HTTP calls, integrations)
  - [ ] condition step (branching logic)
  - [ ] loop step (iteration)
  - [ ] delay step (wait duration)
- [ ] Add workflow execution via manual trigger
- [ ] Add test execution with sample payload

### Phase 2.5: Workflow Runs List

- [ ] Create runs/page.tsx (all runs)
- [ ] Create workflows/[workflowId]/runs/page.tsx (workflow-specific runs)
- [ ] Implement runs-table.tsx
  - [ ] Columns: Run ID, Status, Trigger, Started, Duration, Actions
  - [ ] Real-time status updates via Convex subscription
  - [ ] Copy button for Run ID
- [ ] Add status filters (Running, Completed, Failed, etc.)
- [ ] Add date range filter
- [ ] Implement pagination with usePaginatedQuery

### Phase 2.6: Run Detail View (Visual Debugger)

- [ ] Create runs/[runId]/page.tsx
- [ ] Implement run-timeline.tsx (horizontal progress bar)
- [ ] Implement run-steps.tsx (step list)
  - [ ] Step name and type
  - [ ] Status indicator with icon
  - [ ] Duration display
  - [ ] Attempt count (1/3, 2/3, etc.)
  - [ ] Retry countdown (if retrying)
  - [ ] Expandable input/output
- [ ] Implement step-detail.tsx (expanded view)
- [ ] Implement payload-viewer.tsx (JSON viewer with syntax highlighting)
- [ ] Implement error-display.tsx (error message + stack trace)
  - [ ] Full-screen mode for long stack traces
- [ ] Add Replay button (re-run with same input)
- [ ] Add Cancel button (for running workflows)

### Phase 2.7: Real-time Updates

- [ ] Implement useWorkflowRuns hook with Convex subscription
- [ ] Implement useWorkflowRunDetail hook
- [ ] Add optimistic updates for status changes
- [ ] Add live duration counter for running workflows
- [ ] Add animated status indicators (pulsing for running)

## 🎯 Expected Outcomes

- [ ] Workflows can be created with code editor
- [ ] Workflows can be configured with different trigger types
- [ ] Workflows can be executed manually for testing
- [ ] Workflow runs are displayed with real-time status updates
- [ ] Run detail view shows step-by-step execution
- [ ] Failed steps show error details with stack traces
- [ ] Workflows can be paused, resumed, duplicated, deleted

## ⚠️ Risks & Considerations

- Monaco Editor adds significant bundle size (~2MB) - consider lazy loading
- Long-running workflows may require different execution strategy
- Retry logic must handle edge cases (max attempts, backoff limits)
- Real-time updates must not overwhelm the client with rapid changes

## 🔄 Dependencies

- Phase 1 complete (auth, organizations, RBAC)
- Monaco Editor package installed
- TanStack Table configured
- Convex real-time subscriptions working
