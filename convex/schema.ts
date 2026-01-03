import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════════════════
  // ORGANIZATION & USERS
  // ═══════════════════════════════════════════════════════════════════════

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("business"),
      v.literal("enterprise")
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    usageLimitExecutions: v.number(),
    usageCurrentExecutions: v.number(),
    usageResetAt: v.number(),
    settings: v.object({
      defaultRetryPolicy: v.object({
        maxAttempts: v.number(),
        backoffCoefficient: v.number(),
        initialInterval: v.number(),
        maxInterval: v.number(),
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
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member"),
      v.literal("viewer")
    ),
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
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("expired")
    ),
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
    type: v.union(
      v.literal("publishable"),
      v.literal("secret"),
      v.literal("restricted")
    ),
    keyPrefix: v.string(),
    keyHash: v.string(),
    lastFourChars: v.string(),
    permissions: v.optional(v.array(v.string())),
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
      type: v.union(
        v.literal("webhook"),
        v.literal("schedule"),
        v.literal("manual"),
        v.literal("event")
      ),
      config: v.any(),
    }),
    steps: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        type: v.union(
          v.literal("action"),
          v.literal("condition"),
          v.literal("loop"),
          v.literal("delay")
        ),
        config: v.any(),
        retryPolicy: v.optional(
          v.object({
            maxAttempts: v.number(),
            backoffCoefficient: v.number(),
            initialInterval: v.number(),
            maxInterval: v.number(),
          })
        ),
      })
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("archived")
    ),
    version: v.number(),
    codeHash: v.optional(v.string()),
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
    triggerData: v.any(),
    result: v.optional(v.any()),
    error: v.optional(
      v.object({
        message: v.string(),
        stack: v.optional(v.string()),
        stepId: v.optional(v.string()),
      })
    ),
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
    error: v.optional(
      v.object({
        message: v.string(),
        stack: v.optional(v.string()),
      })
    ),
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
    eventType: v.string(),
    eventId: v.string(),
    source: v.string(),
    payload: v.any(),
    processedAt: v.optional(v.number()),
    status: v.union(
      v.literal("pending"),
      v.literal("processed"),
      v.literal("failed")
    ),
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
    provider: v.string(),
    name: v.string(),
    credentials: v.string(),
    config: v.optional(v.any()),
    status: v.union(
      v.literal("active"),
      v.literal("error"),
      v.literal("disconnected")
    ),
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
    actorId: v.optional(v.id("users")),
    actorType: v.union(
      v.literal("user"),
      v.literal("system"),
      v.literal("api")
    ),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.any()),
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
