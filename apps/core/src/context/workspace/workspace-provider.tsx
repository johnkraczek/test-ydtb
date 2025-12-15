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
    description?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const result = await createOrgMutation.mutateAsync({
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          description: data.description,
          ...data.metadata,
        },
      });

      // Refresh the workspaces list is handled automatically by the mutation

      // Switch to the new workspace and wait for it to complete
      if (result && result.id) {
        await setActiveOrgMutation.mutateAsync({ organizationId: result.id });
        // Refresh the router to ensure the workspace context is updated
        router.refresh();
      }

      // Return the created workspace
      return result;
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  }, [createOrgMutation, setActiveOrgMutation, router]);

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