"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { mockWorkflows, mockWorkflowRuns } from "@/lib/mock-data";

function getWorkflowStats(workflowId: string) {
  const runs = mockWorkflowRuns.filter((r) => r.workflowId === workflowId);
  const last7Days = runs.filter(
    (r) => Date.now() - r.createdAt < 7 * 24 * 60 * 60 * 1000
  );
  return {
    total: last7Days.length,
    lastRun: runs[0],
  };
}

const triggerTypeLabels: Record<string, string> = {
  webhook: "Webhook",
  schedule: "Schedule",
  manual: "Manual",
  event: "Event",
};

export default function WorkflowsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Create and manage your automated workflows.
          </p>
        </div>
        <Button asChild>
          <Link href={`/${orgSlug}/workflows/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Runs (7d)</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkflows.map((workflow) => {
                const stats = getWorkflowStats(workflow._id);
                return (
                  <TableRow key={workflow._id}>
                    <TableCell>
                      <Link
                        href={`/${orgSlug}/workflows/${workflow._id}`}
                        className="font-medium hover:underline"
                      >
                        {workflow.name}
                      </Link>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {workflow.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          workflow.status === "active"
                            ? "default"
                            : workflow.status === "paused"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {triggerTypeLabels[workflow.trigger.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {stats.lastRun ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={stats.lastRun.status} />
                          <RelativeTime date={stats.lastRun.createdAt} />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>{stats.total}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${orgSlug}/workflows/${workflow._id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${orgSlug}/workflows/${workflow._id}/runs`}>
                              View Runs
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {workflow.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
