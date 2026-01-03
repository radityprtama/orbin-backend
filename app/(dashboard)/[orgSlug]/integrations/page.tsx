"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RelativeTime } from "@/components/shared/relative-time";
import { mockIntegrations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const providerLogos: Record<string, string> = {
  slack: "🔔",
  salesforce: "☁️",
  github: "🐙",
  stripe: "💳",
  webhook: "🔗",
};

const availableIntegrations = [
  { provider: "slack", name: "Slack", description: "Send messages and notifications to Slack channels" },
  { provider: "salesforce", name: "Salesforce", description: "Sync leads and contacts with Salesforce CRM" },
  { provider: "github", name: "GitHub", description: "Trigger workflows from GitHub events" },
  { provider: "stripe", name: "Stripe", description: "Handle payment events and billing automation" },
  { provider: "webhook", name: "Custom Webhook", description: "Connect any service via webhooks" },
];

export default function IntegrationsPage() {
  const params = useParams();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const connectedProviders = mockIntegrations.map((i) => i.provider);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect external services to your workflows.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Integration</DialogTitle>
              <DialogDescription>
                Choose a service to connect to your workflows.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {availableIntegrations.map((integration) => {
                const isConnected = connectedProviders.includes(integration.provider);
                return (
                  <button
                    key={integration.provider}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border text-left transition-colors",
                      isConnected
                        ? "bg-muted/50 cursor-not-allowed"
                        : "hover:bg-muted"
                    )}
                    disabled={isConnected}
                  >
                    <div className="text-3xl">{providerLogos[integration.provider]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{integration.name}</p>
                        {isConnected && (
                          <Badge variant="secondary" className="text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="text-2xl font-bold text-green-600">
              {mockIntegrations.filter((i) => i.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {mockIntegrations.filter((i) => i.status === "error").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold">
              {availableIntegrations.length - mockIntegrations.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Connected Integrations</h2>
        <div className="grid grid-cols-2 gap-4">
          {mockIntegrations.map((integration) => (
            <Card key={integration._id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {providerLogos[integration.provider]}
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {integration.provider}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={integration.status === "active" ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {integration.status === "active" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {integration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span>
                      {integration.lastSyncAt ? (
                        <RelativeTime date={integration.lastSyncAt} />
                      ) : (
                        "Never"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-2 h-3 w-3" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
