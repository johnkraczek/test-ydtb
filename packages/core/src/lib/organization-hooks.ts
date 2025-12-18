import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveOrganization,
  listOrganizations,
  setActiveOrganization as setActiveOrgAction,
  createOrganization as createOrgAction,
  getOrganizationMembers,
  inviteUser as inviteUserAction,
} from "@ydtb/core/server/actions/organization-actions";

export function useActiveOrganization() {
  return useQuery({
    queryKey: ["active-organization"],
    queryFn: () => getActiveOrganization(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useListOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => listOrganizations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSetActiveOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId }: { organizationId: string }) =>
      setActiveOrgAction(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-organization"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      slug?: string;
      metadata?: Record<string, any>;
    }) => createOrgAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["active-organization"] });
    },
  });
}

export function useOrganizationMembers(organizationId: string) {
  return useQuery({
    queryKey: ["organization-members", organizationId],
    queryFn: () => getOrganizationMembers(organizationId),
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Export individual functions for server-side usage
export { setActiveOrgAction as setActiveOrganization };
export { createOrgAction as createOrganization };
export { inviteUserAction as inviteUser };