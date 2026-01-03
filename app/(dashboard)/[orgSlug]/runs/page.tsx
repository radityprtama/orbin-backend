"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Filter, RefreshCw } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { CopyButton } from "@/components/shared/copy-button";
import { mockWorkflowRuns, mockWorkflows } from "@/lib/mock-data";

function formatDuration(ms: number | undefined): string {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export default function RunsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const getWorkflowName = (workflowId: string) => {
    const workflow = mockWorkflows.find((w) => w._id === workflowId);
    return workflow?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Runs</h1>
          <p className="text-muted-foreground">
            View all workflow executions across your organization.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Runs</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workflows</SelectItem>
                  {mockWorkflows.map((w) => (
                    <SelectItem key={w._id} value={w._id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkflowRuns.map((run) => (
                <TableRow key={run._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">
                        {run._id.slice(0, 12)}...
                      </code>
                      <CopyButton value={run._id} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/${orgSlug}/workflows/${run.workflowId}`}
                      className="hover:underline"
                    >
                      {getWorkflowName(run.workflowId)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                  <TableCell className="capitalize">{run.triggerType}</TableCell>
                  <TableCell>
                    <RelativeTime date={run.createdAt} />
                  </TableCell>
                  <TableCell>{formatDuration(run.durationMs)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${orgSlug}/runs/${run._id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
