"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Organization } from "@/lib/auth-client";

export async function getActiveOrganization(): Promise<Organization | null> {
  try {
    const response = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    // The response might be the organization directly or have a data property
    if (!response) {
      return null;
    }

    // Handle different response structures
    const org = 'data' in response ? response.data : response;

    // If org is null or undefined, return null
    if (!org || typeof org !== 'object') {
      return null;
    }

    // Check if org has the required properties
    if (!('id' in org && 'name' in org)) {
      return null;
    }

    // Type assertion to access properties
    const orgData = org as {
      id: string;
      name: string;
      slug?: string;
      logo?: string | null;
      metadata?: Record<string, any> | null;
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: orgData.id,
      name: orgData.name,
      slug: orgData.slug || '',
      logo: orgData.logo || null,
      metadata: orgData.metadata || null,
      createdAt: orgData.createdAt || new Date(),
      updatedAt: orgData.updatedAt || new Date(),
    } as Organization;
  } catch (error) {
    console.error("Failed to fetch active organization:", error);
    return null;
  }
}

export async function listOrganizations(): Promise<Organization[]> {
  try {
    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });
    return data as Organization[] || [];
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return [];
  }
}

export async function setActiveOrganization(organizationId: string) {
  try {
    await auth.api.setActiveOrganization({
      body: { organizationId },
      headers: await headers(),
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to set active organization:", error);
    throw error;
  }
}

export async function createOrganization(data: {
  name: string;
  slug?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const orgBody = {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      metadata: data.metadata,
    };
    const result = await auth.api.createOrganization({
      body: orgBody,
    });
    revalidatePath("/");
    return result || null;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
}

export async function getOrganizationMembers(organizationId: string) {
  try {
    const data = await auth.api.listMembers({
      headers: await headers(),
      query: { organizationId },
    });
    return data?.members || [];
  } catch (error) {
    console.error("Failed to fetch organization members:", error);
    return [];
  }
}

export async function inviteUser(data: {
  email: string;
  role: "owner" | "admin" | "member";
  organizationId: string;
}) {
  try {
    const result = await auth.api.createInvitation({
      body: data,
      headers: await headers(),
    });
    revalidatePath(`/workspaces/${data.organizationId}/members`);
    return result;
  } catch (error) {
    console.error("Failed to invite user:", error);
    throw error;
  }
}