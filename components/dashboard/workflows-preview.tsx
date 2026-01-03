"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, RelativeTime } from "@/components/shared";
import { mockWorkflows } from "@/lib/mock-data";
import Link from "next/link";

export function WorkflowsPreview() {
  const activeWorkflows = mockWorkflows.filter((w) => w.status === "active").slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Workflows</CardTitle>
        <Link
          href="/acme-corp/workflows"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeWorkflows.map((workflow) => (
          <Link
            key={workflow._id}
            href={`/acme-corp/workflows/${workflow._id}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{workflow.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {workflow.trigger.type} trigger
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              {workflow.lastRunStatus && (
                <StatusBadge status={workflow.lastRunStatus} showIcon={false} />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {workflow.runCount7Days ?? 0} runs / 7d
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
