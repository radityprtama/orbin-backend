"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Play,
  Ban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { CopyButton } from "@/components/shared/copy-button";
import { mockWorkflowRuns, mockStepExecutions, mockWorkflows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { StepStatus } from "@/lib/types";

function formatDuration(ms: number | undefined): string {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

const stepStatusConfig: Record<StepStatus, { icon: React.ElementType; className: string }> = {
  pending: { icon: Clock, className: "text-muted-foreground" },
  running: { icon: Loader2, className: "text-blue-500 animate-spin" },
  completed: { icon: CheckCircle2, className: "text-green-500" },
  failed: { icon: AlertCircle, className: "text-red-500" },
  retrying: { icon: RefreshCw, className: "text-yellow-500" },
  skipped: { icon: Ban, className: "text-muted-foreground" },
};

export default function RunDetailPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const runId = params.runId as string;

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  const run = mockWorkflowRuns.find((r) => r._id === runId);
  const workflow = run ? mockWorkflows.find((w) => w._id === run.workflowId) : null;
  const steps = mockStepExecutions.filter((s) => s.workflowRunId === runId);
  const selectedStep = selectedStepId ? steps.find((s) => s.stepId === selectedStepId) : steps[0];

  if (!run || !workflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Run not found</p>
      </div>
    );
  }

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${orgSlug}/runs`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Run Details</h1>
            <StatusBadge status={run.status} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <code className="font-mono">{run._id}</code>
            <CopyButton value={run._id} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Replay
          </Button>
          {run.status === "running" && (
            <Button variant="destructive">
              <Ban className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Workflow</p>
            <p className="font-medium">{workflow.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Trigger</p>
            <p className="font-medium capitalize">{run.triggerType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Started</p>
            <p className="font-medium">
              <RelativeTime date={run.createdAt} />
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{formatDuration(run.durationMs)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedSteps} of {totalSteps} steps completed</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  run.status === "failed" ? "bg-red-500" : "bg-primary"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Steps</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-4">
                {steps.map((step, index) => {
                  const config = stepStatusConfig[step.status];
                  const Icon = config.icon;
                  const isSelected = step.stepId === (selectedStep?.stepId || steps[0]?.stepId);

                  return (
                    <button
                      key={step.stepId}
                      onClick={() => setSelectedStepId(step.stepId)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        isSelected ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{step.stepName}</p>
                        <p className="text-xs text-muted-foreground">
                          {step.durationMs ? formatDuration(step.durationMs) : "Pending"}
                        </p>
                      </div>
                      <Icon className={cn("h-4 w-4", config.className)} />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedStep?.stepName || "Step Details"}
              </CardTitle>
              {selectedStep && <StatusBadge status={selectedStep.status} />}
            </div>
          </CardHeader>
          <CardContent>
            {selectedStep ? (
              <Tabs defaultValue="output">
                <TabsList>
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  {selectedStep.error && <TabsTrigger value="error">Error</TabsTrigger>}
                </TabsList>

                <TabsContent value="input" className="mt-4">
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                    <pre className="overflow-auto max-h-[300px]">
                      {JSON.stringify(selectedStep.input || {}, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="output" className="mt-4">
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                    <pre className="overflow-auto max-h-[300px]">
                      {JSON.stringify(selectedStep.output || {}, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                {selectedStep.error && (
                  <TabsContent value="error" className="mt-4">
                    <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                          Error Message
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-300">
                          {selectedStep.error.message}
                        </p>
                      </div>
                      {selectedStep.error.stack && (
                        <div>
                          <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            Stack Trace
                          </p>
                          <pre className="text-xs text-red-600 dark:text-red-300 overflow-auto mt-1">
                            {selectedStep.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            ) : (
              <p className="text-muted-foreground">Select a step to view details</p>
            )}

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Attempt</p>
                <p className="font-medium">
                  {selectedStep?.attempt || 1} / {selectedStep?.maxAttempts || 3}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-medium">
                  {selectedStep?.startedAt ? (
                    <RelativeTime date={selectedStep.startedAt} />
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {formatDuration(selectedStep?.durationMs)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
