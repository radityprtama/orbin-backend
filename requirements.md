# Orbin Dashboard - Product Requirements Document

> **Version**: 1.0.0  
> **Last Updated**: January 2025  
> **Status**: Planning Phase

---

## Executive Summary

Orbin is a **developer-first, event-driven workflow orchestration platform** that enables engineering teams to automate business processes with code—without owning the infrastructure. This document defines the complete requirements for the Orbin Dashboard and API, covering all features, technical architecture, and implementation details.

**Target Users**: Engineering teams, DevOps, Platform Engineers, and Internal Tooling teams who need mission-critical automation with full transparency and control.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Schema](#3-database-schema)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Dashboard Features](#5-dashboard-features)
6. [API Specification](#6-api-specification)
7. [Real-time Features](#7-real-time-features)
8. [File Structure](#8-file-structure)
9. [UI/UX Patterns](#9-uiux-patterns)
10. [Implementation Phases](#10-implementation-phases)

---

## 1. Tech Stack

### Core Framework
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Next.js 15** (App Router) | Frontend + API Routes | Server Components, streaming, parallel routes for modals |
| **TypeScript** | Type Safety | End-to-end type safety with Convex |
| **Convex** | Backend-as-a-Service | Real-time database, serverless functions, WebSocket subscriptions |

### UI Layer
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **shadcn/ui** | Component Library | Accessible, customizable, copy-paste components |
| **Tailwind CSS v4** | Styling | Utility-first, design tokens, dark mode |
| **Hugeicons** | Icon Library | Modern, consistent iconography |
| **Framer Motion** | Animations | Smooth transitions, gesture support |
| **Recharts** | Charts/Graphs | Usage metrics, execution timelines |

### Data Layer
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Convex Queries/Mutations** | Data Fetching | Native reactive hooks via WebSocket (no polling) |
| **TanStack Table** | Data Tables | Sorting, filtering, pagination, column visibility |
| **Upstash Redis** | Rate Limiting + Caching | API rate limits, hot data cache, session storage |
| **Upstash QStash** | Async Job Queue | Workflow execution queue, webhook delivery |

### Authentication & Payments
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Clerk** | Authentication | SSO, MFA, user management, webhook integration |
| **Stripe** | Billing | Usage-based pricing, subscription management |

### Developer Tools
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Monaco Editor** | Code Editor | VS Code-like experience for workflow authoring |
| **Zod** | Validation | Runtime schema validation |
| **date-fns** | Date Handling | Lightweight date formatting |
| **Sonner** | Toast Notifications | Beautiful, accessible toasts |

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ORBIN PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   Next.js App   │────▶│  Convex Backend │────▶│  External APIs  │       │
│  │   (Dashboard)   │◀────│  (Real-time DB) │◀────│  (Integrations) │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│          │                       │                                          │
│          │                       │                                          │
│          ▼                       ▼                                          │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │     Clerk       │     │  Upstash Redis  │     │  Upstash QStash │       │
│  │ (Auth + SSO)    │     │ (Rate Limiting) │     │  (Job Queue)    │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│                                                                             │
│                          ┌─────────────────┐                                │
│                          │     Stripe      │                                │
│                          │   (Billing)     │                                │
│                          └─────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Workflow Execution

```
1. External Event (Webhook) ──▶ Next.js API Route
2. Validate + Persist Event ──▶ Convex (events table)
3. Queue Workflow Execution ──▶ QStash (async)
4. Execute Workflow Steps ──▶ Convex Actions (external APIs)
5. Update Status (real-time) ──▶ Convex Mutations
6. Dashboard Updates ──▶ WebSocket Push (no polling)
```

---

## 3. Database Schema

### Convex Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════════════════
  // ORGANIZATION & USERS
  // ═══════════════════════════════════════════════════════════════════════
  
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("business"), v.literal("enterprise")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    usageLimitExecutions: v.number(), // Monthly execution limit
    usageCurrentExecutions: v.number(), // Current month usage
    usageResetAt: v.number(), // Timestamp for next reset
    settings: v.object({
      defaultRetryPolicy: v.object({
        maxAttempts: v.number(),
        backoffCoefficient: v.number(),
        initialInterval: v.number(), // ms
        maxInterval: v.number(), // ms
      }),
      webhookSecret: v.optional(v.string()),
      alertEmails: v.array(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  users: defineTable({
    externalId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_email", ["email"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member"), v.literal("viewer")),
    invitedBy: v.optional(v.id("users")),
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_org_user", ["organizationId", "userId"]),

  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
    invitedBy: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_token", ["token"])
    .index("by_email", ["email"]),

  // ═══════════════════════════════════════════════════════════════════════
  // API KEYS
  // ═══════════════════════════════════════════════════════════════════════
  
  apiKeys: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    type: v.union(v.literal("publishable"), v.literal("secret"), v.literal("restricted")),
    keyPrefix: v.string(), // e.g., "pk_live_", "sk_live_", "rk_live_"
    keyHash: v.string(), // SHA-256 hash of full key
    lastFourChars: v.string(), // Last 4 chars for display
    permissions: v.optional(v.array(v.string())), // For restricted keys
    lastUsedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_keyHash", ["keyHash"]),

  // ═══════════════════════════════════════════════════════════════════════
  // WORKFLOWS
  // ═══════════════════════════════════════════════════════════════════════
  
  workflows: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    trigger: v.object({
      type: v.union(v.literal("webhook"), v.literal("schedule"), v.literal("manual"), v.literal("event")),
      config: v.any(), // Type-specific config (cron expression, event name, etc.)
    }),
    steps: v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.union(v.literal("action"), v.literal("condition"), v.literal("loop"), v.literal("delay")),
      config: v.any(),
      retryPolicy: v.optional(v.object({
        maxAttempts: v.number(),
        backoffCoefficient: v.number(),
        initialInterval: v.number(),
        maxInterval: v.number(),
      })),
    })),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused"), v.literal("archived")),
    version: v.number(),
    codeHash: v.optional(v.string()), // For GitOps tracking
    createdBy: v.id("users"),
    updatedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_slug", ["organizationId", "slug"])
    .index("by_org_status", ["organizationId", "status"]),

  // ═══════════════════════════════════════════════════════════════════════
  // WORKFLOW EXECUTIONS (Runs)
  // ═══════════════════════════════════════════════════════════════════════
  
  workflowRuns: defineTable({
    organizationId: v.id("organizations"),
    workflowId: v.id("workflows"),
    workflowVersion: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("canceled"),
      v.literal("timed_out")
    ),
    triggerType: v.string(),
    triggerData: v.any(), // Input payload
    result: v.optional(v.any()), // Output payload
    error: v.optional(v.object({
      message: v.string(),
      stack: v.optional(v.string()),
      stepId: v.optional(v.string()),
    })),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_workflow", ["workflowId"])
    .index("by_org_status", ["organizationId", "status"])
    .index("by_org_created", ["organizationId", "createdAt"])
    .index("by_workflow_created", ["workflowId", "createdAt"]),

  // ═══════════════════════════════════════════════════════════════════════
  // STEP EXECUTIONS (Event Sourcing)
  // ═══════════════════════════════════════════════════════════════════════
  
  stepExecutions: defineTable({
    organizationId: v.id("organizations"),
    workflowRunId: v.id("workflowRuns"),
    stepId: v.string(),
    stepName: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("retrying"),
      v.literal("skipped")
    ),
    attempt: v.number(),
    maxAttempts: v.number(),
    input: v.optional(v.any()),
    output: v.optional(v.any()),
    error: v.optional(v.object({
      message: v.string(),
      stack: v.optional(v.string()),
    })),
    nextRetryAt: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_run", ["workflowRunId"])
    .index("by_run_step", ["workflowRunId", "stepId"])
    .index("by_org_status", ["organizationId", "status"]),

  // ═══════════════════════════════════════════════════════════════════════
  // EVENTS (Event Bus)
  // ═══════════════════════════════════════════════════════════════════════
  
  events: defineTable({
    organizationId: v.id("organizations"),
    eventType: v.string(), // e.g., "lead.created", "order.completed"
    eventId: v.string(), // Idempotency key
    source: v.string(), // e.g., "salesforce", "stripe", "manual"
    payload: v.any(),
    processedAt: v.optional(v.number()),
    status: v.union(v.literal("pending"), v.literal("processed"), v.literal("failed")),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_type", ["organizationId", "eventType"])
    .index("by_eventId", ["eventId"])
    .index("by_org_status", ["organizationId", "status"]),

  // ═══════════════════════════════════════════════════════════════════════
  // INTEGRATIONS (Connected Apps)
  // ═══════════════════════════════════════════════════════════════════════
  
  integrations: defineTable({
    organizationId: v.id("organizations"),
    provider: v.string(), // "salesforce", "slack", "github", etc.
    name: v.string(), // User-given name
    credentials: v.string(), // Encrypted credentials
    config: v.optional(v.any()), // Provider-specific config
    status: v.union(v.literal("active"), v.literal("error"), v.literal("disconnected")),
    lastSyncAt: v.optional(v.number()),
    connectedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_provider", ["organizationId", "provider"]),

  // ═══════════════════════════════════════════════════════════════════════
  // AUDIT LOGS
  // ═══════════════════════════════════════════════════════════════════════
  
  auditLogs: defineTable({
    organizationId: v.id("organizations"),
    actorId: v.optional(v.id("users")), // null for system actions
    actorType: v.union(v.literal("user"), v.literal("system"), v.literal("api")),
    action: v.string(), // "workflow.created", "member.invited", etc.
    resourceType: v.string(), // "workflow", "member", "apiKey", etc.
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.any()), // Action-specific data
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_org_created", ["organizationId", "createdAt"])
    .index("by_actor", ["actorId"]),

  // ═══════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  notifications: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    type: v.union(
      v.literal("workflow_failed"),
      v.literal("usage_threshold"),
      v.literal("member_joined"),
      v.literal("integration_error"),
      v.literal("system")
    ),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"])
    .index("by_org", ["organizationId"]),

  // ═══════════════════════════════════════════════════════════════════════
  // FILE STORAGE (Workflow Artifacts)
  // ═══════════════════════════════════════════════════════════════════════
  
  artifacts: defineTable({
    organizationId: v.id("organizations"),
    workflowRunId: v.optional(v.id("workflowRuns")),
    stepExecutionId: v.optional(v.id("stepExecutions")),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_run", ["workflowRunId"]),
});
```

---

## 4. Authentication & Authorization

### Clerk Integration

```typescript
// convex/auth.ts
import { internalMutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v } from "convex/values";

// Webhook handlers for Clerk events
export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  async handler(ctx, { data }: { data: UserJSON }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0]?.email_address ?? "",
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

// Helper functions
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
```

### Role-Based Access Control

```typescript
// convex/lib/permissions.ts
import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

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
```

### Middleware (Next.js)

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/public(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 5. Dashboard Features

### 5.1 Overview Dashboard

**Purpose**: At-a-glance view of system health and recent activity.

**Components**:
| Component | Description |
|-----------|-------------|
| **Usage Card** | Current month executions vs limit with gauge visualization |
| **Status Cards** | Running, Completed, Failed counts for last 24h |
| **Activity Feed** | Real-time stream of workflow executions |
| **Quick Actions** | Create workflow, View failed runs, Settings |

**Metrics**:
- Execution count (current period)
- Success rate (%)
- Average latency (ms)
- Active workflows count

---

### 5.2 Workflows

#### 5.2.1 Workflow List

**Features**:
- Table view with sorting/filtering
- Status badges (Active, Paused, Draft, Archived)
- Last run timestamp and status
- Execution count (last 7 days)
- Quick actions (Edit, Pause, Duplicate, Delete)

**Filters**:
- Status
- Trigger type
- Created by
- Date range

---

#### 5.2.2 Workflow Editor

**Features**:
- Monaco Editor for code-based workflow definition
- Visual preview of workflow steps
- AI-powered workflow generation (natural language → code)
- Test execution with sample payload
- Version history with diff view

**Editor Tabs**:
1. **Code** - TypeScript/Python workflow definition
2. **Trigger** - Configure trigger type and settings
3. **Steps** - Visual step configuration
4. **Settings** - Retry policies, timeout, notifications
5. **History** - Version history with rollback

---

#### 5.2.3 Workflow Runs (Executions)

**List View**:
| Column | Description |
|--------|-------------|
| Run ID | Unique identifier with copy button |
| Status | Badge with icon (Running, Completed, Failed, etc.) |
| Trigger | What triggered the run |
| Started | Relative timestamp |
| Duration | Time taken (or elapsed if running) |
| Actions | View details, Replay, Cancel |

**Detail View (Visual Debugger)**:
- **Timeline Visualization**: Horizontal bar showing step progression
- **Step List**: Expandable rows with:
  - Step name and type
  - Status indicator
  - Duration
  - Attempt count / max attempts
  - Retry countdown (if retrying)
  - Input/Output JSON viewer
  - Error details with stack trace (full-screen mode)
- **Event Replay**: Re-run with same input
- **Comparison**: Compare with previous runs

**Status Indicators**:
| Status | Color | Icon |
|--------|-------|------|
| Pending | Gray | Clock |
| Running | Blue (pulsing) | Loader |
| Completed | Green | Check |
| Failed | Red | X |
| Retrying | Yellow | RefreshCw |
| Canceled | Slate | Ban |
| Timed Out | Orange | AlertTriangle |

---

### 5.3 Events

**Purpose**: View and manage the event bus.

**Features**:
- Real-time event stream (400ms polling or WebSocket)
- Filter by event type, source, status
- Event detail view with full payload
- Manual event replay
- Dead letter queue management

**Table Columns**:
- Event Type
- Source
- Status (Pending, Processed, Failed)
- Payload preview
- Received at
- Processed at
- Actions

---

### 5.4 Integrations

**Purpose**: Connect external services.

**Supported Integrations** (Phase 1):
- Slack
- Salesforce
- GitHub
- Stripe
- Custom Webhooks

**UI Components**:
- Integration cards with connection status
- OAuth connection flow
- Credential management
- Test connection button
- Sync status and last sync time

---

### 5.5 API Keys

**Purpose**: Manage programmatic access.

**Features**:
- Create API key modal:
  - Name
  - Type (Publishable, Secret, Restricted)
  - Permissions (for restricted)
  - Expiration (optional)
- Key display: Reveal-once pattern with copy button
- List view:
  - Name
  - Type badge
  - Masked key (`sk_live_****abcd`)
  - Last used
  - Created by
  - Actions (Revoke)
- Rolling rotation support

---

### 5.6 Settings

#### Organization Settings
- Organization name and slug
- Billing email
- Default retry policy
- Webhook secret rotation
- Alert email configuration

#### Members
- Member list with roles
- Invite member modal (email + role)
- Pending invitations with resend/revoke
- Role management (Admin/Member/Viewer)
- Remove member (with confirmation)

#### Billing
- Current plan display
- Usage metrics:
  - Executions (current/limit)
  - Usage percentage gauge
  - Period countdown
- Upgrade/downgrade buttons
- Payment method management (Stripe portal)
- Invoice history

#### Audit Logs
- Searchable log table:
  - Timestamp
  - Actor (user or system)
  - Action (verb.resource)
  - Resource
  - IP Address
  - Details (expandable)
- Export to CSV
- Filter by actor, action, date range

---

### 5.7 Notifications

**In-App Notifications**:
- Bell icon with unread badge
- Dropdown panel with notification list
- Mark as read (individual/all)
- Link to relevant resource

**Email Notifications** (configurable):
- Workflow failure alerts
- Usage threshold warnings (70%, 90%, 100%)
- Team member joined
- Integration errors

---

## 6. API Specification

### Webhook Ingestion

```typescript
// app/api/webhooks/ingest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.ip ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      }
    );
  }

  // Validate API key
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  // Process event
  const body = await req.json();
  const eventId = req.headers.get("x-idempotency-key") ?? crypto.randomUUID();

  try {
    await fetchMutation(api.events.ingest, {
      apiKey,
      eventType: body.type,
      eventId,
      source: body.source ?? "webhook",
      payload: body.data,
    });

    return NextResponse.json({ received: true, eventId });
  } catch (error) {
    console.error("Webhook ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 }
    );
  }
}
```

### Clerk Webhook Handler

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { internal } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      await fetchMutation(internal.auth.upsertFromClerk, { data: evt.data });
      break;
    case "user.deleted":
      if (evt.data.id) {
        await fetchMutation(internal.auth.deleteFromClerk, { 
          clerkUserId: evt.data.id 
        });
      }
      break;
  }

  return new Response("OK", { status: 200 });
}
```

### Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fetchMutation } from "convex/nextjs";
import { internal } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      await fetchMutation(internal.billing.syncSubscription, {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        plan: subscription.items.data[0]?.price.lookup_key ?? "free",
      });
      break;

    case "customer.subscription.deleted":
      const deletedSub = event.data.object as Stripe.Subscription;
      await fetchMutation(internal.billing.cancelSubscription, {
        stripeSubscriptionId: deletedSub.id,
      });
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      await fetchMutation(internal.billing.recordPayment, {
        stripeCustomerId: invoice.customer as string,
        amount: invoice.amount_paid,
        invoiceId: invoice.id,
      });
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## 7. Real-time Features

### Convex Real-time Subscriptions

```typescript
// convex/workflowRuns.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireOrgAccess } from "./lib/permissions";

// Real-time workflow runs list
export const listByOrganization = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { organizationId, status, limit = 50 }) => {
    await requireOrgAccess(ctx, organizationId);

    let query = ctx.db
      .query("workflowRuns")
      .withIndex("by_org_created", (q) => q.eq("organizationId", organizationId))
      .order("desc");

    if (status) {
      query = ctx.db
        .query("workflowRuns")
        .withIndex("by_org_status", (q) => 
          q.eq("organizationId", organizationId).eq("status", status as any)
        );
    }

    return await query.take(limit);
  },
});

// Real-time single run with steps
export const getWithSteps = query({
  args: { runId: v.id("workflowRuns") },
  handler: async (ctx, { runId }) => {
    const run = await ctx.db.get(runId);
    if (!run) throw new Error("Run not found");

    await requireOrgAccess(ctx, run.organizationId);

    const steps = await ctx.db
      .query("stepExecutions")
      .withIndex("by_run", (q) => q.eq("workflowRunId", runId))
      .collect();

    const workflow = await ctx.db.get(run.workflowId);

    return { ...run, steps, workflow };
  },
});
```

### React Hooks Usage

```typescript
// hooks/use-workflow-runs.ts
"use client";

import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useWorkflowRuns(organizationId: Id<"organizations">) {
  // Real-time subscription - updates automatically via WebSocket
  return useQuery(api.workflowRuns.listByOrganization, { organizationId });
}

export function useWorkflowRunsPaginated(organizationId: Id<"organizations">) {
  // Paginated real-time subscription
  return usePaginatedQuery(
    api.workflowRuns.listPaginated,
    { organizationId },
    { initialNumItems: 25 }
  );
}

export function useWorkflowRunDetail(runId: Id<"workflowRuns">) {
  // Real-time run with steps - updates as steps complete
  return useQuery(api.workflowRuns.getWithSteps, { runId });
}
```

### Optimistic Updates

```typescript
// convex/workflows.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateStatus = mutation({
  args: {
    workflowId: v.id("workflows"),
    status: v.union(v.literal("active"), v.literal("paused")),
  },
  handler: async (ctx, { workflowId, status }) => {
    const workflow = await ctx.db.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await requireOrgAccess(ctx, workflow.organizationId, "member");

    await ctx.db.patch(workflowId, { 
      status, 
      updatedAt: Date.now() 
    });

    return { success: true };
  },
});
```

```typescript
// Client-side with optimistic update
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function WorkflowToggle({ workflow }) {
  const updateStatus = useMutation(api.workflows.updateStatus)
    .withOptimisticUpdate((localStore, args) => {
      const current = localStore.getQuery(api.workflows.get, { 
        workflowId: args.workflowId 
      });
      if (current) {
        localStore.setQuery(api.workflows.get, { workflowId: args.workflowId }, {
          ...current,
          status: args.status,
        });
      }
    });

  return (
    <Switch
      checked={workflow.status === "active"}
      onCheckedChange={(checked) => 
        updateStatus({ 
          workflowId: workflow._id, 
          status: checked ? "active" : "paused" 
        })
      }
    />
  );
}
```

---

## 8. File Structure

```
orbin-app/
├── app/
│   ├── (auth)/                          # Auth pages (no sidebar)
│   │   ├── layout.tsx
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx
│   │   ├── sign-up/[[...sign-up]]/
│   │   │   └── page.tsx
│   │   └── accept-invite/[token]/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                     # Dashboard pages (with sidebar)
│   │   ├── layout.tsx                   # Dashboard layout with Sidebar
│   │   ├── [orgSlug]/                   # Organization context
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Overview dashboard
│   │   │   │
│   │   │   ├── workflows/
│   │   │   │   ├── page.tsx             # Workflow list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx         # Create workflow
│   │   │   │   └── [workflowId]/
│   │   │   │       ├── page.tsx         # Workflow detail/editor
│   │   │   │       ├── runs/
│   │   │   │       │   └── page.tsx     # Workflow runs list
│   │   │   │       └── settings/
│   │   │   │           └── page.tsx     # Workflow settings
│   │   │   │
│   │   │   ├── runs/
│   │   │   │   ├── page.tsx             # All runs list
│   │   │   │   └── [runId]/
│   │   │   │       └── page.tsx         # Run detail (visual debugger)
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── page.tsx             # Event stream
│   │   │   │   └── [eventId]/
│   │   │   │       └── page.tsx         # Event detail
│   │   │   │
│   │   │   ├── integrations/
│   │   │   │   ├── page.tsx             # Integrations list
│   │   │   │   └── [provider]/
│   │   │   │       └── page.tsx         # Integration config
│   │   │   │
│   │   │   ├── api-keys/
│   │   │   │   └── page.tsx             # API keys management
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── layout.tsx           # Settings sidebar
│   │   │       ├── page.tsx             # General settings
│   │   │       ├── members/
│   │   │       │   └── page.tsx
│   │   │       ├── billing/
│   │   │       │   └── page.tsx
│   │   │       └── audit-log/
│   │   │           └── page.tsx
│   │   │
│   │   ├── @modal/                      # Parallel route for modals
│   │   │   └── (.)workflows/new/
│   │   │       └── page.tsx
│   │   │
│   │   └── onboarding/
│   │       └── page.tsx                 # New user onboarding
│   │
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── clerk/
│   │   │   │   └── route.ts
│   │   │   ├── stripe/
│   │   │   │   └── route.ts
│   │   │   └── ingest/
│   │   │       └── route.ts             # Event ingestion endpoint
│   │   └── [...catchall]/
│   │       └── route.ts                 # Catch-all for API versioning
│   │
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing page (redirect)
│   ├── loading.tsx                      # Global loading
│   ├── error.tsx                        # Global error
│   └── not-found.tsx                    # 404 page
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── command.tsx
│   │   ├── data-table.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── app-sidebar.tsx              # Main sidebar
│   │   ├── sidebar-nav.tsx              # Sidebar navigation items
│   │   ├── user-nav.tsx                 # User dropdown
│   │   ├── org-switcher.tsx             # Organization switcher
│   │   ├── command-menu.tsx             # Cmd+K command palette
│   │   ├── notifications.tsx            # Notification bell/panel
│   │   └── breadcrumbs.tsx
│   │
│   ├── dashboard/
│   │   ├── overview-cards.tsx           # Usage, status cards
│   │   ├── activity-feed.tsx            # Recent activity
│   │   └── quick-actions.tsx
│   │
│   ├── workflows/
│   │   ├── workflow-table.tsx           # Workflow list table
│   │   ├── workflow-editor.tsx          # Monaco editor wrapper
│   │   ├── workflow-preview.tsx         # Visual step preview
│   │   ├── workflow-form.tsx            # Create/edit form
│   │   ├── trigger-config.tsx           # Trigger configuration
│   │   └── ai-generator.tsx             # AI workflow generator
│   │
│   ├── runs/
│   │   ├── runs-table.tsx               # Runs list table
│   │   ├── run-timeline.tsx             # Visual timeline bar
│   │   ├── run-steps.tsx                # Step list with details
│   │   ├── step-detail.tsx              # Single step expanded view
│   │   ├── payload-viewer.tsx           # JSON viewer
│   │   └── error-display.tsx            # Error with stack trace
│   │
│   ├── events/
│   │   ├── event-stream.tsx             # Real-time event list
│   │   ├── event-detail.tsx             # Event payload view
│   │   └── event-filters.tsx
│   │
│   ├── integrations/
│   │   ├── integration-card.tsx
│   │   ├── oauth-button.tsx
│   │   └── integration-form.tsx
│   │
│   ├── settings/
│   │   ├── settings-sidebar.tsx
│   │   ├── member-table.tsx
│   │   ├── invite-modal.tsx
│   │   ├── billing-card.tsx
│   │   ├── usage-gauge.tsx
│   │   └── audit-log-table.tsx
│   │
│   ├── api-keys/
│   │   ├── api-key-table.tsx
│   │   ├── create-key-modal.tsx
│   │   └── key-display.tsx              # Reveal-once key display
│   │
│   └── shared/
│       ├── status-badge.tsx             # Reusable status badge
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       ├── confirm-dialog.tsx
│       ├── copy-button.tsx
│       └── relative-time.tsx
│
├── convex/
│   ├── _generated/                      # Auto-generated
│   ├── schema.ts                        # Database schema
│   ├── auth.ts                          # Auth helpers
│   ├── crons.ts                         # Scheduled jobs
│   │
│   ├── lib/
│   │   ├── permissions.ts               # RBAC helpers
│   │   ├── encryption.ts                # Credential encryption
│   │   └── utils.ts
│   │
│   ├── organizations.ts                 # Organization CRUD
│   ├── users.ts                         # User queries
│   ├── members.ts                       # Membership management
│   ├── invitations.ts                   # Invite flow
│   ├── apiKeys.ts                       # API key management
│   ├── workflows.ts                     # Workflow CRUD
│   ├── workflowRuns.ts                  # Run queries/mutations
│   ├── stepExecutions.ts                # Step management
│   ├── events.ts                        # Event ingestion/queries
│   ├── integrations.ts                  # Integration management
│   ├── auditLogs.ts                     # Audit logging
│   ├── notifications.ts                 # Notification management
│   ├── billing.ts                       # Billing/usage
│   └── artifacts.ts                     # File storage
│
├── hooks/
│   ├── use-organization.ts              # Current org context
│   ├── use-workflow-runs.ts             # Real-time runs
│   ├── use-command-menu.ts              # Command palette state
│   ├── use-copy-to-clipboard.ts
│   └── use-debounce.ts
│
├── lib/
│   ├── utils.ts                         # cn(), formatters
│   ├── constants.ts                     # App constants
│   ├── validations.ts                   # Zod schemas
│   └── stripe.ts                        # Stripe client
│
├── providers/
│   ├── convex-provider.tsx              # Convex + Clerk provider
│   ├── theme-provider.tsx               # Dark mode
│   └── org-provider.tsx                 # Organization context
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── og-image.png
│
├── styles/
│   └── globals.css                      # Tailwind + custom styles
│
├── middleware.ts                        # Auth middleware
├── next.config.ts
├── tailwind.config.ts
├── components.json                      # shadcn/ui config
├── tsconfig.json
├── package.json
└── .env.local                           # Environment variables
```

---

## 9. UI/UX Patterns

### Design System

**Colors** (Tailwind CSS v4):
```css
/* globals.css */
@theme {
  --color-orbin-50: #f0f9ff;
  --color-orbin-100: #e0f2fe;
  --color-orbin-200: #bae6fd;
  --color-orbin-300: #7dd3fc;
  --color-orbin-400: #38bdf8;
  --color-orbin-500: #0ea5e9;
  --color-orbin-600: #0284c7;
  --color-orbin-700: #0369a1;
  --color-orbin-800: #075985;
  --color-orbin-900: #0c4a6e;
  --color-orbin-950: #082f49;
}
```

**Status Colors**:
| Status | Background | Text | Icon |
|--------|------------|------|------|
| Pending | `bg-slate-100` | `text-slate-700` | Clock |
| Running | `bg-blue-100` | `text-blue-700` | Loader (animated) |
| Completed | `bg-green-100` | `text-green-700` | CheckCircle |
| Failed | `bg-red-100` | `text-red-700` | XCircle |
| Retrying | `bg-yellow-100` | `text-yellow-700` | RefreshCw |
| Canceled | `bg-slate-100` | `text-slate-500` | Ban |
| Timed Out | `bg-orange-100` | `text-orange-700` | AlertTriangle |

### Component Patterns

**Status Badge**:
```tsx
// components/shared/status-badge.tsx
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Loader, Clock, RefreshCw, Ban, AlertTriangle } from "@hugeicons/react";

const statusConfig = {
  pending: { bg: "bg-slate-100", text: "text-slate-700", icon: Clock },
  running: { bg: "bg-blue-100", text: "text-blue-700", icon: Loader },
  completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  retrying: { bg: "bg-yellow-100", text: "text-yellow-700", icon: RefreshCw },
  canceled: { bg: "bg-slate-100", text: "text-slate-500", icon: Ban },
  timed_out: { bg: "bg-orange-100", text: "text-orange-700", icon: AlertTriangle },
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      config.bg, config.text
    )}>
      <Icon className={cn("size-3.5", status === "running" && "animate-spin")} />
      {status.replace("_", " ")}
    </span>
  );
}
```

**Data Table Pattern**:
```tsx
// Use TanStack Table with shadcn/ui Table components
// Features: sorting, filtering, column visibility, pagination
// See shadcn/ui data-table documentation for full implementation
```

**Command Palette**:
```tsx
// Cmd+K to open
// Sections: Navigation, Recent, Actions
// Real-time search with fuzzy matching
```

### Layout Patterns

**Dashboard Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar (240px)          │ Main Content                     │
│ ┌─────────────────────┐  │ ┌─────────────────────────────┐ │
│ │ Logo + Org Switcher │  │ │ Header (Breadcrumbs, User) │ │
│ ├─────────────────────┤  │ ├─────────────────────────────┤ │
│ │ Navigation          │  │ │                             │ │
│ │ - Overview          │  │ │ Page Content                │ │
│ │ - Workflows         │  │ │                             │ │
│ │ - Runs              │  │ │                             │ │
│ │ - Events            │  │ │                             │ │
│ │ - Integrations      │  │ │                             │ │
│ │ - API Keys          │  │ │                             │ │
│ ├─────────────────────┤  │ │                             │ │
│ │ Settings            │  │ │                             │ │
│ │ Help & Docs         │  │ │                             │ │
│ └─────────────────────┘  │ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Run Detail Layout** (Split Pane):
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Run ID, Status, Duration, Actions                   │
├─────────────────────────────────────────────────────────────┤
│ Timeline Bar: Visual representation of step progress        │
├───────────────────────────┬─────────────────────────────────┤
│ Step List (30%)           │ Step Detail (70%)               │
│ ┌───────────────────────┐ │ ┌─────────────────────────────┐ │
│ │ ▶ Step 1 (completed)  │ │ │ Input/Output Tabs           │ │
│ │ ▶ Step 2 (running)    │ │ │                             │ │
│ │ ○ Step 3 (pending)    │ │ │ JSON Viewer                 │ │
│ │ ○ Step 4 (pending)    │ │ │                             │ │
│ └───────────────────────┘ │ └─────────────────────────────┘ │
└───────────────────────────┴─────────────────────────────────┘
```

---

## 10. Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

**Goal**: Core infrastructure and authentication.

- [ ] Project setup (Next.js 15, Convex, Tailwind, shadcn/ui)
- [ ] Clerk authentication integration
- [ ] Basic dashboard layout (sidebar, navigation)
- [ ] Organization CRUD
- [ ] User management
- [ ] Member invitation flow
- [ ] RBAC implementation

**Deliverables**:
- Working auth flow
- Organization management
- Team member management

---

### Phase 2: Workflow Core (Weeks 4-6)

**Goal**: Workflow creation and execution.

- [ ] Workflow CRUD
- [ ] Workflow editor (Monaco)
- [ ] Trigger configuration (webhook, schedule, manual)
- [ ] Workflow execution engine
- [ ] Step execution with retries
- [ ] Real-time run status updates
- [ ] Run detail view (visual debugger)

**Deliverables**:
- Create and run workflows
- View execution history
- Debug failed runs

---

### Phase 3: Event System (Weeks 7-8)

**Goal**: Event bus and processing.

- [ ] Webhook ingestion endpoint
- [ ] Event persistence
- [ ] Event → Workflow trigger
- [ ] Event stream UI
- [ ] Dead letter queue
- [ ] Event replay

**Deliverables**:
- Receive external events
- Trigger workflows from events
- View event history

---

### Phase 4: Integrations (Weeks 9-10)

**Goal**: Connect external services.

- [ ] Integration framework
- [ ] OAuth flow for providers
- [ ] Credential encryption/storage
- [ ] Slack integration
- [ ] GitHub integration
- [ ] Custom webhook integration

**Deliverables**:
- Connect Slack/GitHub
- Use integrations in workflows

---

### Phase 5: Billing & Polish (Weeks 11-12)

**Goal**: Monetization and production readiness.

- [ ] Stripe integration
- [ ] Usage tracking
- [ ] Plan limits enforcement
- [ ] Billing UI
- [ ] API key management
- [ ] Audit logs
- [ ] Notifications system
- [ ] Command palette (Cmd+K)
- [ ] Dark mode
- [ ] Performance optimization

**Deliverables**:
- Usage-based billing
- API key management
- Audit trail
- Production-ready UI

---

### Phase 6: AI Features (Weeks 13-14)

**Goal**: AI-powered workflow generation.

- [ ] Natural language workflow generator
- [ ] AI step suggestions
- [ ] Error diagnosis assistant
- [ ] Workflow optimization suggestions

**Deliverables**:
- Generate workflows from prompts
- AI-powered debugging

---

## Environment Variables

```bash
# .env.local

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=prod:your-deploy-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Upstash QStash
QSTASH_TOKEN=...
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Dashboard Load Time** | < 1s | Lighthouse |
| **Workflow Execution Latency** | < 100ms | P95 cold start |
| **Real-time Update Latency** | < 50ms | WebSocket delivery |
| **API Uptime** | 99.9% | Monitoring |
| **Error Rate** | < 0.1% | Workflow failures |

---

## Open Questions

1. **GitOps Integration**: How deep should Git integration go? Full GitOps with PR reviews, or simpler version history?

2. **Multi-region**: Should workflow execution support edge regions from Phase 1, or add later?

3. **SDK Generation**: Auto-generate TypeScript/Python SDKs for each organization's workflows?

4. **Marketplace**: Future consideration for sharing/selling workflow templates?

---

*This document is a living specification. Update as requirements evolve.*
