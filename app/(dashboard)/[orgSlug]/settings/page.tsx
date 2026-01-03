"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockOrganizations } from "@/lib/mock-data";

export default function SettingsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const org = mockOrganizations.find((o) => o.slug === orgSlug);

  if (!org) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Update your organization's basic information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization Name</label>
            <Input defaultValue={org.name} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input defaultValue={org.slug} />
            <p className="text-sm text-muted-foreground">
              Used in URLs: orbin.dev/{org.slug}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Email</label>
            <Input defaultValue={org.billingEmail || ""} type="email" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Retry Policy</CardTitle>
          <CardDescription>
            Configure the default retry behavior for workflow steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Attempts</label>
              <Input
                type="number"
                defaultValue={org.settings.defaultRetryPolicy.maxAttempts}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Backoff Coefficient</label>
              <Input
                type="number"
                step="0.1"
                defaultValue={org.settings.defaultRetryPolicy.backoffCoefficient}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Interval (ms)</label>
              <Input
                type="number"
                defaultValue={org.settings.defaultRetryPolicy.initialInterval}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Interval (ms)</label>
              <Input
                type="number"
                defaultValue={org.settings.defaultRetryPolicy.maxInterval}
              />
            </div>
          </div>
          <Button>Update Policy</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Notifications</CardTitle>
          <CardDescription>
            Email addresses to receive workflow failure alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {org.settings.alertEmails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input defaultValue={email} />
                <Button variant="outline" size="icon">
                  ×
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline">Add Email</Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Organization</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this organization and all its data.
              </p>
            </div>
            <Button variant="destructive">Delete Organization</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
