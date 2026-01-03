"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Settings, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockWorkflows } from "@/lib/mock-data";

export default function WorkflowDetailPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const workflowId = params.workflowId as string;

  const workflow = mockWorkflows.find((w) => w._id === workflowId);
  const [activeTab, setActiveTab] = useState("code");

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Workflow not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${orgSlug}/workflows`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{workflow.name}</h1>
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
          </div>
          {workflow.description && (
            <p className="text-muted-foreground">{workflow.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${orgSlug}/workflows/${workflowId}/runs`}>
              <Clock className="mr-2 h-4 w-4" />
              View Runs
            </Link>
          </Button>
          <Button variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Test Run
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="trigger">Trigger</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow Definition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                <pre className="overflow-auto">
{`import { workflow, step } from "@orbin/sdk";

export default workflow("${workflow.slug}", {
  trigger: { type: "${workflow.trigger.type}" },
  
  steps: [
${workflow.steps.map((s) => `    step("${s.id}", {
      name: "${s.name}",
      type: "${s.type}",
      handler: async (ctx) => {
        // Step implementation
        return { success: true };
      }
    })`).join(",\n")}
  ]
});`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Full Monaco Editor integration coming soon. This is a preview of your workflow code.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trigger" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trigger Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Trigger Type</label>
                <p className="text-muted-foreground capitalize">{workflow.trigger.type}</p>
              </div>
              {workflow.trigger.type === "webhook" && (
                <div>
                  <label className="text-sm font-medium">Webhook URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      readOnly
                      value={`https://api.orbin.dev/v1/webhooks/${workflow._id}`}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>
              )}
              {workflow.trigger.type === "schedule" && (
                <div>
                  <label className="text-sm font-medium">Cron Expression</label>
                  <Input
                    value={(workflow.trigger.config as { cron?: string })?.cron || "0 9 * * *"}
                    className="font-mono mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflow.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {step.type}
                      </p>
                    </div>
                    <Badge variant="outline">{step.type}</Badge>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Workflow Name</label>
                <Input value={workflow.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input value={workflow.description || ""} className="mt-1" />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Retry Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Max Attempts</label>
                    <Input type="number" defaultValue={3} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Initial Interval (ms)</label>
                    <Input type="number" defaultValue={1000} className="mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Version {workflow.version}</p>
                    <p className="text-sm text-muted-foreground">Current version</p>
                  </div>
                  <Badge>Current</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div>
                    <p className="font-medium">Version {workflow.version - 1}</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
