// Re-export everything from the new modular structure for backwards compatibility
// This ensures all existing imports continue to work

// Direct imports from individual files to avoid export resolution issues
// Separate value and type exports for isolatedModules compatibility

// Auth exports
export { user } from "./auth/users";
export { session } from "./auth/sessions";
export { account } from "./auth/accounts";
export { verification } from "./auth/verifications";
export { passkey } from "./auth/passkeys";

export type { User, NewUser } from "./auth/users";
export type { Session, NewSession } from "./auth/sessions";
export type { Account, NewAccount } from "./auth/accounts";
export type { Passkey, NewPasskey } from "./auth/passkeys";

// Workspace exports
export { workspaces } from "./workspaces/workspaces";
export { workspaceMembers } from "./workspaces/members";
export { invitation } from "./workspaces/invitations";

export type { Workspace, NewWorkspace } from "./workspaces/workspaces";
export type { WorkspaceMember, NewWorkspaceMember } from "./workspaces/members";
export type { Invitation, NewInvitation } from "./workspaces/invitations";

// Export auth relations
export { userRelations, sessionRelations, accountRelations, passkeyRelations } from "./auth/relations";

// Export workspace relations
export { workspaceMembersRelations, invitationRelations, workspacesRelations } from "./workspaces/relations";

// Note: Cross-domain relations are not exported to avoid circular dependency issues
// Applications can import relations directly from their domain folders as needed

// Export utilities
export { createTable } from "./utils";