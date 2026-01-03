"use client";

import { cn } from "@/lib/utils";
import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Ban,
  AlertTriangle,
} from "lucide-react";
import type { RunStatus, StepStatus, WorkflowStatus, EventStatus, IntegrationStatus } from "@/lib/types";

type Status = RunStatus | StepStatus | WorkflowStatus | EventStatus | IntegrationStatus;

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", icon: Clock },
  running: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-300", icon: Loader2 },
  completed: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: CheckCircle2 },
  failed: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300", icon: XCircle },
  retrying: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-700 dark:text-yellow-300", icon: RefreshCw },
  canceled: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", icon: Ban },
  timed_out: { bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-700 dark:text-orange-300", icon: AlertTriangle },
  skipped: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", icon: Ban },
  draft: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", icon: Clock },
  active: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: CheckCircle2 },
  paused: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-700 dark:text-yellow-300", icon: Clock },
  archived: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", icon: Ban },
  processed: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300", icon: CheckCircle2 },
  error: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300", icon: XCircle },
  disconnected: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-500 dark:text-slate-400", icon: Ban },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize",
        config.bg,
        config.text,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn("size-3.5", status === "running" && "animate-spin")}
        />
      )}
      {status.replace("_", " ")}
    </span>
  );
}
