import { createTable } from "../utils";
import { index, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { user } from "../auth/users";

export const workspaceMembers = createTable("workspace_members", {
    id: text("id").primaryKey(),  // Let Better Auth set the ID
    organizationId: text("organization_id")  // Better Auth expects this field name
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member', 'guest'] })
        .notNull()
        .default('member'),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    workspaceUserIdx: index("workspace_members_organization_user_idx").on(table.organizationId, table.userId),
}));

// Type exports for convenience
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;