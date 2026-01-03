"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge, RelativeTime } from "@/components/shared";
import { mockWorkflowRuns } from "@/lib/mock-data";
import Link from "next/link";

export function ActivityFeed() {
  const recentRuns = mockWorkflowRuns.slice(0, 10);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-0">
            {recentRuns.map((run) => (
              <Link
                key={run._id}
                href={`/acme-corp/runs/${run._id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusBadge status={run.status} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {run.workflow?.name ?? "Unknown Workflow"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {run.triggerType} trigger
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-muted-foreground">
                    <RelativeTime date={run.createdAt} />
                  </p>
                  {run.durationMs && (
                    <p className="text-xs text-muted-foreground">
                      {run.durationMs}ms
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
