"use client";

import { useState, useCallback } from "react";
import {
  useActiveOrganization,
  useListOrganizations,
  useSetActiveOrganization,
  useCreateOrganization,
} from "@/lib/organization-hooks";
import { WorkspaceContext } from "./workspace-context";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: Props) {
  const { data: activeWorkspace, isLoading: isActiveLoading } = useActiveOrganization();
  const { data: workspaces, isLoading: isListLoading, refetch } = useListOrganizations();
  const setActiveOrgMutation = useSetActiveOrganization();
  const createOrgMutation = useCreateOrganization();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const switchWorkspace = useCallback(async (workspaceId: string) => {
    setIsSwitching(true);
    try {
      await setActiveOrgMutation.mutateAsync({ organizationId: workspaceId });
      // Refresh current page to update workspace-scoped data
      router.refresh();
    } catch (error) {
      console.error("Failed to switch workspace:", error);
    } finally {
      setIsSwitching(false);
    }
  }, [setActiveOrgMutation, router]);

  const refreshWorkspaces = useCallback(() => {
    refetch();
  }, [refetch]);

  const createWorkspace = useCallback(async (data: {
    name: string;
    slug?: string;
    description?: string
  }) => {
    try {
      const result = await createOrgMutation.mutateAsync({
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          description: data.description,
        },
      });

      // Refresh the workspaces list is handled automatically by the mutation

      // The result should contain the created organization
      if (result && result.id) {
        await switchWorkspace(result.id);
      }

      router.push("/");
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  }, [createOrgMutation, switchWorkspace, router]);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace: activeWorkspace ?? null,
        workspaces: workspaces ?? null,
        isLoading: isActiveLoading || isListLoading || isSwitching,
        switchWorkspace,
        refreshWorkspaces,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}