"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { eq, and, gt } from "drizzle-orm";
import { workspaces, workspaceInvitations } from "@/server/db/schema";

export async function createWorkspace(data: {
  name: string;
  slug?: string;
  description?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's createOrganization method
    const result = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          description: data.description,
        },
      } as any,
    });

    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw new Error("Failed to create workspace");
  }
}

export async function getUserWorkspaces() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  try {
    // Use better-auth's listOrganizations method
    const workspaces = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return workspaces;
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    return [];
  }
}

export async function switchWorkspace(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's setActiveOrganization method
    await auth.api.setActiveOrganization({
      body: {
        organizationId: workspaceId,
      } as any,
      headers: await headers(),
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to switch workspace:", error);
    throw new Error("Failed to switch workspace");
  }
}

export async function getWorkspaceMembers(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's listMembers method
    const members = await auth.api.listMembers({
      headers: await headers(),
      query: {
        organizationId: workspaceId,
      },
    });

    return members?.members || [];
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return [];
  }
}

export async function inviteUserToWorkspace(data: {
  workspaceId: string;
  email: string;
  role: "owner" | "admin" | "member";
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's createInvitation method
    const result = await auth.api.createInvitation({
      body: {
        email: data.email,
        role: data.role,
        organizationId: data.workspaceId,
      },
      headers: await headers(),
    });

    revalidatePath(`/workspaces/${data.workspaceId}/members`);
    return result;
  } catch (error) {
    console.error("Failed to invite user:", error);
    throw new Error("Failed to invite user to workspace");
  }
}

export async function validateSlug(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Check if slug is already taken
  const existingWorkspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, slug),
  });

  return !existingWorkspace;
}

export async function acceptInvitation(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Use Better Auth's acceptInvitation method
  try {
    const result = await auth.api.acceptInvitation({
      body: { token },
      headers: await headers(),
    });

    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    throw new Error("Invalid or expired invitation");
  }
}

export async function getPendingInvitations(email: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Query pending invitations for this email
  const invitations = await db.query.workspaceInvitations.findMany({
    where: and(
      eq(workspaceInvitations.email, email),
      eq(workspaceInvitations.status, "pending"),
      gt(workspaceInvitations.expiresAt, new Date())
    ),
    with: {
      workspace: {
        columns: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });

  return invitations;
}