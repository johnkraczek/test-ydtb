"use server";

import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Organization } from "@/lib/auth-client";

export async function getActiveOrganization(): Promise<Organization | null> {
  try {
    const data = await auth.api.getActiveOrganization({
      headers: await headers(),
    });
    return data as Organization | null;
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
    revalidatePath("/dashboard");
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
    const result = await auth.api.createOrganization({
      body: data,
      headers: await headers(),
    });
    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
}

export async function getOrganizationMembers(organizationId: string) {
  try {
    const data = await auth.api.getOrganizationMembers({
      headers: await headers(),
      query: { organizationId },
    });
    return data || [];
  } catch (error) {
    console.error("Failed to fetch organization members:", error);
    return [];
  }
}

export async function inviteUser(data: {
  email: string;
  role: string;
  organizationId: string;
}) {
  try {
    const result = await auth.api.inviteUser({
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