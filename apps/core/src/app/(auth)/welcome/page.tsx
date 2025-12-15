import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getUserWorkspaces, getPendingInvitations } from "@/server/actions/workspace";
import CreateWorkspaceWizard from "@/components/auth/create-workspace-wizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Check } from "lucide-react";
import Link from "next/link";

export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect(`/verify-otp?email=${encodeURIComponent(session.user.email)}`);
  }

  // Check if user already has workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length > 0) {
    redirect("/");
  }

  // Show pending invitations if any
  const invitations = await getPendingInvitations(session.user.email);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to YDTB!
          </h1>
          <p className="mt-2 text-gray-600">
            Let's get your workspace set up so you can start collaborating
          </p>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                You have {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''}
              </CardTitle>
              <CardDescription>
                Accept an invitation to join an existing workspace, or create a new one below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invitation.workspace.name}</p>
                      <p className="text-sm text-gray-500">
                        {invitation.workspace.slug}.ydtb.app
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{invitation.role}</Badge>
                    <Link href={`/welcome/invite/${invitation.token}`}>
                      <Button>
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Create Workspace Wizard */}
        <CreateWorkspaceWizard
          user={session.user}
          invitations={invitations}
          onSuccess={() => redirect("/")}
        />
      </div>
    </div>
  );
}