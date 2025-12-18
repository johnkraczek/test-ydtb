import { createTable } from "../utils";
import { index, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { user } from "../auth/users";

export const invitation = createTable("invitations", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    organizationId: text("organization_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member', 'guest'] })
        .notNull()
        .default('member'),
    status: varchar("status", { length: 20, enum: ['pending', 'accepted', 'rejected', 'expired'] })
        .notNull()
        .default('pending'),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").unique(), // Let Better Auth manage this
    inviterId: text("inviter_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    tokenIdx: index("invitations_token_idx").on(table.token),
    emailOrgIdx: index("invitations_email_organization_idx").on(table.email, table.organizationId),
}));

// Type exports for convenience
export type Invitation = typeof invitation.$inferSelect;
export type NewInvitation = typeof invitation.$inferInsert;