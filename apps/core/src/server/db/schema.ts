import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgTable,
    pgTableCreator,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Use pgTableCreator for consistent ydtb_ prefix
export const createTable = pgTableCreator((name) => `ydtb_${name}`);

// Workspaces table - core multi-tenancy
export const workspaces = createTable("workspaces", {
    id: varchar("id", { length: 20 }).primaryKey(), // 10-20 alphanumeric for URL-friendly IDs
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

// Workspace members table - links users to workspaces
export const workspaceMembers = createTable("workspace_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: varchar("workspace_id", { length: 20 })
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(), // Will reference better-auth user ID
    role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member', 'guest'] })
        .notNull()
        .default('member'),
    joinedAt: timestamp("joined_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    workspaceUserIdx: index("workspace_members_workspace_user_idx").on(table.workspaceId, table.userId),
}));

// Relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
    members: many(workspaceMembers),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId],
        references: [workspaces.id],
    }),
}));

// Type exports for convenience
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;