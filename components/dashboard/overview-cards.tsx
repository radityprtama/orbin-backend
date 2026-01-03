"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDashboardStats } from "@/lib/mock-data";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  Rocket,
} from "lucide-react";

export function OverviewCards() {
  const stats = mockDashboardStats;
  const usagePercent = Math.round((stats.executionsThisMonth / stats.executionLimit) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.executionsThisMonth.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {usagePercent}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            of {stats.executionLimit.toLocaleString()} limit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle2 className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedLast24h} completed in last 24h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed (24h)</CardTitle>
          <XCircle className="size-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.failedLast24h}</div>
          <p className="text-xs text-muted-foreground">
            {stats.runningNow} currently running
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          <Zap className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgLatencyMs}ms</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeWorkflows} active workflows
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Card className="flex-1 cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <Rocket className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Create Workflow</p>
            <p className="text-xs text-muted-foreground">Start automating</p>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1 cursor-pointer hover:bg-muted/50 transition-colors">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-red-500/10">
            <XCircle className="size-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-sm">View Failed Runs</p>
            <p className="text-xs text-muted-foreground">Debug issues</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
