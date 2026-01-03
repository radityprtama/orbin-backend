// Core entity types for Orbin Dashboard

export type Plan = "free" | "pro" | "business" | "enterprise";
export type Role = "owner" | "admin" | "member" | "viewer";
export type WorkflowStatus = "draft" | "active" | "paused" | "archived";
export type TriggerType = "webhook" | "schedule" | "manual" | "event";
export type RunStatus = "pending" | "running" | "completed" | "failed" | "canceled" | "timed_out";
export type StepStatus = "pending" | "running" | "completed" | "failed" | "retrying" | "skipped";
export type StepType = "action" | "condition" | "loop" | "delay";
export type EventStatus = "pending" | "processed" | "failed";
export type IntegrationStatus = "active" | "error" | "disconnected";
export type ApiKeyType = "publishable" | "secret" | "restricted";
export type NotificationType = "workflow_failed" | "usage_threshold" | "member_joined" | "integration_error" | "system";

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  billingEmail?: string;
  usageLimitExecutions: number;
  usageCurrentExecutions: number;
  usageResetAt: number;
  settings: {
    defaultRetryPolicy: RetryPolicy;
    webhookSecret?: string;
    alertEmails: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffCoefficient: number;
  initialInterval: number;
  maxInterval: number;
}

export interface User {
  _id: string;
  externalId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrganizationMember {
  _id: string;
  organizationId: string;
  userId: string;
  user?: User;
  role: Role;
  invitedBy?: string;
  joinedAt: number;
}

export interface Invitation {
  _id: string;
  organizationId: string;
  email: string;
  role: Exclude<Role, "owner">;
  invitedBy: string;
  token: string;
  expiresAt: number;
  status: "pending" | "accepted" | "expired";
  createdAt: number;
}

export interface ApiKey {
  _id: string;
  organizationId: string;
  name: string;
  type: ApiKeyType;
  keyPrefix: string;
  keyHash: string;
  lastFourChars: string;
  permissions?: string[];
  lastUsedAt?: number;
  expiresAt?: number;
  createdBy: string;
  createdByUser?: User;
  createdAt: number;
  revokedAt?: number;
}

export interface Workflow {
  _id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  trigger: {
    type: TriggerType;
    config: Record<string, unknown>;
  };
  steps: WorkflowStep[];
  status: WorkflowStatus;
  version: number;
  codeHash?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  // Computed fields for display
  lastRunAt?: number;
  lastRunStatus?: RunStatus;
  runCount7Days?: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  config: Record<string, unknown>;
  retryPolicy?: RetryPolicy;
}

export interface WorkflowRun {
  _id: string;
  organizationId: string;
  workflowId: string;
  workflow?: Workflow;
  workflowVersion: number;
  status: RunStatus;
  triggerType: string;
  triggerData: unknown;
  result?: unknown;
  error?: {
    message: string;
    stack?: string;
    stepId?: string;
  };
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  createdAt: number;
  steps?: StepExecution[];
}

export interface StepExecution {
  _id: string;
  organizationId: string;
  workflowRunId: string;
  stepId: string;
  stepName: string;
  status: StepStatus;
  attempt: number;
  maxAttempts: number;
  input?: unknown;
  output?: unknown;
  error?: {
    message: string;
    stack?: string;
  };
  nextRetryAt?: number;
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  createdAt: number;
}

export interface Event {
  _id: string;
  organizationId: string;
  eventType: string;
  eventId: string;
  source: string;
  payload: unknown;
  processedAt?: number;
  status: EventStatus;
  createdAt: number;
}

export interface Integration {
  _id: string;
  organizationId: string;
  provider: string;
  name: string;
  credentials: string; // Encrypted
  config?: Record<string, unknown>;
  status: IntegrationStatus;
  lastSyncAt?: number;
  connectedBy: string;
  connectedByUser?: User;
  createdAt: number;
  updatedAt: number;
}

export interface AuditLog {
  _id: string;
  organizationId: string;
  actorId?: string;
  actor?: User;
  actorType: "user" | "system" | "api";
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
}

export interface Notification {
  _id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

// Dashboard stats
export interface DashboardStats {
  executionsToday: number;
  executionsThisMonth: number;
  executionLimit: number;
  successRate: number;
  avgLatencyMs: number;
  activeWorkflows: number;
  runningNow: number;
  failedLast24h: number;
  completedLast24h: number;
}
