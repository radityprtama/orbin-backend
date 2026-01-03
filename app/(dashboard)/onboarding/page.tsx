"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasOrganization = useQuery(api.users.hasAnyOrganization);
  const organizations = useQuery(api.organizations.listForUser);
  const createOrganization = useMutation(api.organizations.create);

  if (!isLoaded || hasOrganization === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (hasOrganization && organizations && organizations.length > 0) {
    const firstOrg = organizations[0];
    if (firstOrg) {
      router.push(`/${firstOrg.slug}`);
      return null;
    }
  }

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await createOrganization({ name, slug });
      router.push(`/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Orbin</CardTitle>
          <CardDescription>
            Create your organization to get started with workflow automation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">orbin.dev/</span>
                <Input
                  id="slug"
                  placeholder="acme"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  required
                  pattern="[a-z0-9-]+"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}
            <Button type="submit" disabled={isCreating || !name || !slug} className="w-full">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
