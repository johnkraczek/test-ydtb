"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { workspaces, workspaceMembers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
      },
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
      },
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
    // Use better-auth's getOrganizationMembers method
    const members = await auth.api.getOrganizationMembers({
      headers: await headers(),
      query: {
        organizationId: workspaceId,
      },
    });

    return members;
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return [];
  }
}

export async function inviteUserToWorkspace(data: {
  workspaceId: string;
  email: string;
  role: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's inviteUser method
    const result = await auth.api.inviteUser({
      body: {
        email: data.email,
        role: data.role,
        organizationId: data.workspaceId,
      },
    });

    revalidatePath(`/workspaces/${data.workspaceId}/members`);
    return result;
  } catch (error) {
    console.error("Failed to invite user:", error);
    throw new Error("Failed to invite user to workspace");
  }
}