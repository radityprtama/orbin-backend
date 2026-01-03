import { OverviewCards, QuickActions, ActivityFeed, WorkflowsPreview } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your workflows and system health at a glance.
        </p>
      </div>

      <OverviewCards />

      <QuickActions />

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityFeed />
        <WorkflowsPreview />
      </div>
    </div>
  );
}
