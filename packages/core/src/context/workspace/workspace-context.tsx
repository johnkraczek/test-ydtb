"use client";

import { createContext, useContext } from "react";
import type { Organization } from "@ydtb/core/lib/auth-client";

interface WorkspaceContextType {
  activeWorkspace: Organization | null;
  workspaces: Organization[] | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => void;
  createWorkspace: (data: {
    name: string;
    slug?: string;
    description?: string;
    metadata?: Record<string, any>;
  }) => Promise<any>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}