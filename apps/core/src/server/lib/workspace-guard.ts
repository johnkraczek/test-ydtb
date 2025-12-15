import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/server/actions/workspace";

export const WORKSPACE_STATUS = {
  NEEDS_AUTH: "NEEDS_AUTH",
  NEEDS_VERIFICATION: "NEEDS_VERIFICATION",
  NEEDS_WORKSPACE: "NEEDS_WORKSPACE",
  READY: "READY",
} as const;

export type WorkspaceStatus = keyof typeof WORKSPACE_STATUS;

export async function getUserWorkspaceStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { status: WORKSPACE_STATUS.NEEDS_AUTH };
  }

  if (!session.user.emailVerified) {
    return {
      status: WORKSPACE_STATUS.NEEDS_VERIFICATION,
      email: session.user.email,
    };
  }

  // Check if user has any workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) {
    return {
      status: WORKSPACE_STATUS.NEEDS_WORKSPACE,
      user: session.user,
    };
  }

  return {
    status: WORKSPACE_STATUS.READY,
    workspaces,
    user: session.user,
  };
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function ProtectedRoute({
  children,
  redirectTo = "/welcome"
}: ProtectedRouteProps) {
  const status = await getUserWorkspaceStatus();

  if (status.status === WORKSPACE_STATUS.NEEDS_AUTH) {
    redirect('/login');
  }

  if (status.status === WORKSPACE_STATUS.NEEDS_VERIFICATION) {
    redirect(`/verify-otp?email=${encodeURIComponent(status.email || '')}`);
  }

  if (status.status === WORKSPACE_STATUS.NEEDS_WORKSPACE) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}