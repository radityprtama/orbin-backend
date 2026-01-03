"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Plus,
  Key,
  Trash2,
  Eye,
  EyeOff,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RelativeTime } from "@/components/shared/relative-time";
import { CopyButton } from "@/components/shared/copy-button";
import { mockApiKeys } from "@/lib/mock-data";

const keyTypeColors: Record<string, string> = {
  publishable: "bg-blue-100 text-blue-700",
  secret: "bg-purple-100 text-purple-700",
  restricted: "bg-orange-100 text-orange-700",
};

export default function ApiKeysPage() {
  const params = useParams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("secret");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleCreateKey = () => {
    const mockKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setCreatedKey(mockKey);
  };

  const handleCloseCreate = () => {
    setShowCreateDialog(false);
    setNewKeyName("");
    setNewKeyType("secret");
    setCreatedKey(null);
    setShowKey(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage API keys for programmatic access to your workflows.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {createdKey ? "API Key Created" : "Create API Key"}
              </DialogTitle>
              <DialogDescription>
                {createdKey
                  ? "Make sure to copy your API key now. You won't be able to see it again!"
                  : "Create a new API key for programmatic access."}
              </DialogDescription>
            </DialogHeader>

            {createdKey ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted font-mono text-sm">
                  <Input
                    readOnly
                    value={showKey ? createdKey : "•".repeat(40)}
                    className="border-0 bg-transparent p-0 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <CopyButton value={createdKey} />
                </div>
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> This key will only be shown once. Store it securely.
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newKeyType} onValueChange={setNewKeyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publishable">
                        Publishable - Safe for client-side use
                      </SelectItem>
                      <SelectItem value="secret">
                        Secret - Full access, server-side only
                      </SelectItem>
                      <SelectItem value="restricted">
                        Restricted - Limited permissions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              {createdKey ? (
                <Button onClick={handleCloseCreate}>Done</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCloseCreate}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey} disabled={!newKeyName}>
                    Create Key
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>
            Keys are used to authenticate API requests. Keep your secret keys safe!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.filter((k) => !k.revokedAt).map((apiKey) => (
                <TableRow key={apiKey._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {apiKey.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={keyTypeColors[apiKey.type]}>
                      {apiKey.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm font-mono text-muted-foreground">
                      {apiKey.keyPrefix}****{apiKey.lastFourChars}
                    </code>
                  </TableCell>
                  <TableCell>
                    {apiKey.lastUsedAt ? (
                      <RelativeTime date={apiKey.lastUsedAt} />
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <RelativeTime date={apiKey.createdAt} />
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to revoke "{apiKey.name}"? This action cannot be undone and any applications using this key will stop working.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Revoke Key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
