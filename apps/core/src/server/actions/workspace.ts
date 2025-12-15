"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { requireAuth } from "@/server/auth-session";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { user } from "@/server/db/schema";
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
  await requireAuth();

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
  await requireAuth();

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
  // Auth is required to use better-auth client
  await requireAuth();

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
    // Re-throw with more context
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Full invitation error:", error);
    throw new Error(`Failed to invite user to workspace: ${errorMessage}`);
  }
}

export async function validateSlug(slug: string) {
  // Authentication is required to validate slugs
  await requireAuth();

  try {
    // Use Better Auth's checkOrganizationSlug server method
    const result = await auth.api.checkOrganizationSlug({
      body: { slug },
      headers: await headers(),
    });

    // Better Auth returns { status: boolean }
    return result.status;
  } catch (error) {
    // If checkSlug fails, assume slug is not available
    console.error("Error checking slug availability:", error);
    return false;
  }
}

export async function acceptInvitation(token: string) {
  await requireAuth();

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

  if (!session?.user?.email) {
    return [];
  }

  try {
    // Use Better Auth's listUserInvitations API
    const invitations = await auth.api.listUserInvitations({
      query: {
        email: session.user.email,
      },
    });

    // Filter for pending status if needed
    const pendingInvites = invitations?.filter((invite: any) =>
      invite.status === 'pending'
    ) || [];

    // Get user details for the inviter
    const invitesWithInviter = await Promise.all(
      pendingInvites.map(async (invite: any) => {
        let inviter = null;

        // Fetch inviter details if we have an inviterId
        if (invite.inviterId) {
          try {
            // Get inviter from database
            const inviterRecord = await db
              .select({
                id: user.id,
                name: user.name,
                email: user.email,
              })
              .from(user)
              .where(eq(user.id, invite.inviterId))
              .limit(1);

            if (inviterRecord.length > 0) {
              inviter = inviterRecord[0];
            }
          } catch (error) {
            // If we can't fetch inviter details, leave as null
            inviter = null;
          }
        }

        return {
          id: invite.id,
          email: invite.email,
          organizationId: invite.organizationId,
          role: invite.role || 'member',
          status: invite.status || 'pending',
          expiresAt: invite.expiresAt || new Date(),
          inviterId: invite.inviterId || '',
          createdAt: invite.createdAt || new Date(),
          organization: {
            id: invite.organizationId,
            name: invite.organizationName || 'Unknown Workspace',
            slug: invite.organizationId, // Using organizationId as slug since it's not provided
          },
          inviter,
        };
      })
    );

    return invitesWithInviter;
  } catch (error) {
    return [];
  }
}