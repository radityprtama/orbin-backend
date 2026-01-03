"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = params.token as string;
  const invitation = useQuery(api.invitations.getByToken, { token });
  const acceptInvitation = useMutation(api.invitations.accept);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/sign-in?redirect_url=/accept-invite/${token}`);
    }
  }, [isLoaded, isSignedIn, router, token]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invitation === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invitation === null) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/onboarding")} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const result = await acceptInvitation({ token });
      const org = await api.organizations.get;
      router.push(`/onboarding`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invitation");
      setIsAccepting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Join {invitation.organization?.name}</CardTitle>
        <CardDescription>
          {invitation.inviter?.name} invited you to join as a {invitation.role}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        <Button onClick={handleAccept} disabled={isAccepting} className="w-full">
          {isAccepting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Accepting...
            </>
          ) : (
            "Accept Invitation"
          )}
        </Button>
        <Button variant="ghost" onClick={() => router.push("/")} className="w-full">
          Decline
        </Button>
      </CardContent>
    </Card>
  );
}
