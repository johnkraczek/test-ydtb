"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ydtb/ui/base/button";
import { Input } from "@ydtb/ui/base/input";
import { Label } from "@ydtb/ui/base/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ydtb/ui/base/card";
import { Alert, AlertDescription } from "@ydtb/ui/base/alert";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { acceptInvitation } from "@/server/actions/workspace";
import { WORKSPACE_WIZARD_ERRORS } from "@/lib/constants/workspace-wizard";

interface JoinWorkspaceFormProps {
  token?: string;
}

export default function JoinWorkspaceForm({ token }: JoinWorkspaceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState(token || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!inviteCode.trim()) {
        setError("Please enter an invitation code");
        return;
      }

      await acceptInvitation(inviteCode);
      setSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("Failed to join workspace:", err);
      setError(err instanceof Error ? err.message : WORKSPACE_WIZARD_ERRORS.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle>Welcome to the workspace!</CardTitle>
          <CardDescription>
            You've successfully joined the workspace. Redirecting you to the dashboard...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Join Workspace
        </CardTitle>
        <CardDescription>
          Enter your invitation code to join an existing workspace
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inviteCode">Invitation Code</Label>
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter invitation code"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Workspace"
            )}
          </Button>

          <Link href="/welcome">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to workspace setup
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}