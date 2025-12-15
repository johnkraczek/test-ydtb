import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/server/actions/workspace";
import JoinWorkspaceForm from "@/components/auth/join-workspace-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function JoinWorkspacePage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <Link href="/welcome">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to workspace setup
          </Button>
        </Link>

        {/* Join Form */}
        <JoinWorkspaceForm />
      </div>
    </div>
  );
}