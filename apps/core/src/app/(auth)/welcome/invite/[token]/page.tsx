import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getUserWorkspaces, acceptInvitation } from "@/server/actions/workspace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Check, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: {
    token: string;
  };
}

export default async function InvitationPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?redirectTo=/welcome/invite/${params.token}`);
  }

  if (!session.user.emailVerified) {
    redirect(`/verify-otp?email=${encodeURIComponent(session.user.email)}&redirectTo=/welcome/invite/${params.token}`);
  }

  // Check if user already has workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length > 0) {
    redirect("/");
  }

  // Try to accept the invitation
  let success = false;
  let error = "";
  let workspaceName = "";

  try {
    const result = await acceptInvitation(params.token);
    success = true;
    // The result should contain workspace information
    workspaceName = result?.data?.organization?.name || result?.organization?.name || "the workspace";
  } catch (err) {
    console.error("Failed to accept invitation:", err);
    error = err instanceof Error ? err.message : "Invalid or expired invitation";
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Welcome to {workspaceName}!</CardTitle>
              <CardDescription>
                You've successfully joined the workspace. You'll be redirected to your dashboard in a moment.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button>
                  Go to Dashboard Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-600 mt-4">
            You will be redirected to your dashboard in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>
              We couldn't process your invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex flex-col space-y-2">
              <Link href="/welcome/join">
                <Button variant="outline" className="w-full">
                  Try entering the code manually
                </Button>
              </Link>

              <Link href="/welcome">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to workspace setup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}