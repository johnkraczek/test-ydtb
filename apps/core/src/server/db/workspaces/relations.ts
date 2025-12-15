import { relations } from "drizzle-orm";
import { workspaces } from "./workspaces";
import { workspaceMembers } from "./members";
import { invitation } from "./invitations";

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.organizationId],
        references: [workspaces.id],
    }),
    // user relation moved to cross-domain relations to avoid circular dependency
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(workspaces, {
        fields: [invitation.organizationId],
        references: [workspaces.id],
    }),
    // inviter relation moved to cross-domain relations to avoid circular dependency
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
    members: many(workspaceMembers),
    invitations: many(invitation),
    // sessions relation moved to cross-domain relations to avoid circular dependency
}));