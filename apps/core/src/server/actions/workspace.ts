"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { workspaces } from "@/server/db/schema";
import { requireAuth } from "@/server/auth-session";
import type {
  CreateOrganizationBody
} from "@/types/better-auth";

export async function createWorkspace(data: {
  name: string;
  slug?: string;
  description?: string;
  metadata?: any;
  logo?: string;
  members?: Array<{
    email: string;
    role: "owner" | "admin" | "member" | "guest";
    message?: string;
  }>;
}) {
  await requireAuth();

  try {
    // Use better-auth's createOrganization method
    const orgBody: CreateOrganizationBody = {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      logo: data.logo,
      metadata: {
        description: data.description,
        ...data.metadata,
      },
    };

    const workspace = await auth.api.createOrganization({
      body: orgBody,
      headers: await headers(),
    });

    if (!workspace || !workspace.id) {
      throw new Error("Failed to create workspace - invalid response from createOrganization");
    }

    revalidatePath("/");
    return workspace;
  } catch (error) {
    // Re-throw with more context
    const errorStatus = (error as any)?.status || (error as any)?.statusCode;
    if (errorStatus === 'UNAUTHORIZED' || errorStatus === 401) {
      throw new Error(`Authentication failed while creating workspace. Please ensure you're properly logged in.`);
    }

    const errorMessage = (error as any)?.message || (error instanceof Error ? error.message : 'Unknown error');
    throw new Error(`Failed to create workspace: ${errorMessage}`);
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
    // Use Better Auth's listOrganizations method
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return organizations || [];
  } catch (error) {
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
      },
      headers: await headers(),
    });

    revalidatePath("/");
  } catch (error) {
    throw new Error(`Failed to switch workspace: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    throw new Error("Failed to invite user to workspace");
  }
}

export async function validateSlug(slug: string) {
  // Authentication is required to validate slugs
  await requireAuth();

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
      body: { invitationId: token },
      headers: await headers(),
    });

    revalidatePath("/");
    return result;
  } catch (error) {
    throw new Error("Invalid or expired invitation");
  }
}

export async function getPendingInvitations() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Use Better Auth's listInvitations method
  try {
    const invitations = await auth.api.listInvitations({
      headers: await headers(),
    });

    return invitations || [];
  } catch (error) {
    return [];
  }
}