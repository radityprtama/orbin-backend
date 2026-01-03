"use client";

import { useParams } from "next/navigation";
import {
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockOrganizations } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const planFeatures: Record<string, string[]> = {
  free: ["1,000 executions/month", "1 team member", "Community support"],
  pro: ["10,000 executions/month", "5 team members", "Email support", "API access"],
  business: ["100,000 executions/month", "Unlimited team members", "Priority support", "SSO", "Audit logs"],
  enterprise: ["Unlimited executions", "Unlimited team members", "24/7 support", "SSO", "Audit logs", "Custom SLA"],
};

const planPrices: Record<string, string> = {
  free: "$0",
  pro: "$29",
  business: "$99",
  enterprise: "Custom",
};

export default function BillingPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const org = mockOrganizations.find((o) => o.slug === orgSlug);

  if (!org) return null;

  const usagePercent = (org.usageCurrentExecutions / org.usageLimitExecutions) * 100;
  const resetDate = new Date(org.usageResetAt);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the {org.plan} plan.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1 capitalize">
              {org.plan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{planPrices[org.plan]}</span>
            {org.plan !== "enterprise" && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Plan Features</p>
            <ul className="space-y-2">
              {planFeatures[org.plan].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            {org.plan !== "enterprise" && (
              <Button>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            )}
            <Button variant="outline">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Period</CardTitle>
          <CardDescription>
            Resets {formatDistanceToNow(resetDate, { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Workflow Executions</span>
              <span className="font-medium">
                {org.usageCurrentExecutions.toLocaleString()} / {org.usageLimitExecutions.toLocaleString()}
              </span>
            </div>
            <Progress value={usagePercent} className="h-2" />
          </div>

          {usagePercent >= 80 && (
            <div className="flex items-start gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-sm text-yellow-800 dark:text-yellow-200">
              <Info className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Approaching usage limit</p>
                <p>You've used {usagePercent.toFixed(0)}% of your monthly executions. Consider upgrading your plan.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Badge>Default</Badge>
          </div>
          <Button variant="outline">Update Payment Method</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Download invoices for your records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "Jan 1, 2025", amount: "$29.00", status: "Paid" },
              { date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
              { date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
            ].map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-green-600">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
