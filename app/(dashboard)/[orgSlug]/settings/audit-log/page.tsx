"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Filter,
  Download,
  User,
  Settings,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { mockAuditLogs, mockUsers } from "@/lib/mock-data";

const actionIcons: Record<string, React.ReactNode> = {
  "workflow.created": <Settings className="h-4 w-4" />,
  "workflow.updated": <Settings className="h-4 w-4" />,
  "workflow.deleted": <Settings className="h-4 w-4" />,
  "member.invited": <User className="h-4 w-4" />,
  "member.removed": <User className="h-4 w-4" />,
  "apiKey.created": <Key className="h-4 w-4" />,
  "apiKey.revoked": <Key className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-red-100 text-red-700",
  invited: "bg-purple-100 text-purple-700",
  removed: "bg-orange-100 text-orange-700",
  revoked: "bg-red-100 text-red-700",
};

export default function AuditLogPage() {
  const params = useParams();
  const [actionFilter, setActionFilter] = useState("all");

  const logsWithUsers = mockAuditLogs.map((log) => ({
    ...log,
    actor: log.actorId ? mockUsers.find((u) => u._id === log.actorId) : null,
  }));

  const filteredLogs = actionFilter === "all" 
    ? logsWithUsers 
    : logsWithUsers.filter((log) => log.action.includes(actionFilter));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                A record of all actions taken in your organization.
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="workflow">Workflows</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                  <SelectItem value="apiKey">API Keys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Search logs..." className="max-w-xs" />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const [resource, action] = log.action.split(".");
                return (
                  <TableRow key={log._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-muted">
                          {actionIcons[log.action] || <Settings className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{resource}</p>
                          <Badge className={actionColors[action] || "bg-slate-100 text-slate-700"}>
                            {action}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.actorType === "system" ? (
                        <span className="text-muted-foreground">System</span>
                      ) : (
                        <span>{log.actor?.name || "Unknown"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {log.resourceId || "-"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {log.ipAddress || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <RelativeTime date={log.createdAt} />
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
