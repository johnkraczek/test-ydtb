import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import { organizationClient } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [passkeyClient(), organizationClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgotPassword,
  resetPassword,
} = authClient;

// Organization-specific exports
export const {
  setActiveOrganization,
  setActiveTeam,
  useActiveOrganization,
  useActiveTeam,
  useListOrganizations,
  useOrganizationMembers,
} = authClient.organization;

export type Session = typeof authClient.$Infer.Session;