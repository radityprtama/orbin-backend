"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  RefreshCw,
  Filter,
  Play,
  Eye,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RelativeTime } from "@/components/shared/relative-time";
import { CopyButton } from "@/components/shared/copy-button";
import { mockEvents } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  processed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function EventsPage() {
  const params = useParams();
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            View and manage your event stream.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{mockEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Processed</p>
            <p className="text-2xl font-bold text-green-600">
              {mockEvents.filter((e) => e.status === "processed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-slate-600">
              {mockEvents.filter((e) => e.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {mockEvents.filter((e) => e.status === "failed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Event Stream</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lead.created">lead.created</SelectItem>
                  <SelectItem value="order.completed">order.completed</SelectItem>
                  <SelectItem value="user.signup">user.signup</SelectItem>
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
                <TableHead>Event ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">
                        {event.eventId.slice(0, 16)}...
                      </code>
                      <CopyButton value={event.eventId} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {event.eventType}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{event.source}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[event.status]}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RelativeTime date={event.createdAt} />
                  </TableCell>
                  <TableCell>
                    {event.processedAt ? (
                      <RelativeTime date={event.processedAt} />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Event Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Event ID</p>
                                <p className="font-mono text-sm">{event.eventId}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <Badge variant="outline">{event.eventType}</Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Source</p>
                                <p className="capitalize">{event.source}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge className={statusColors[event.status]}>
                                  {event.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Payload</p>
                              <ScrollArea className="h-[300px]">
                                <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                                  <pre>
                                    {JSON.stringify(event.payload, null, 2)}
                                  </pre>
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
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
