import { createTable } from "../utils";
import { index, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";
import { workspaces } from "../workspaces/workspaces";

export const session = createTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    activeOrganizationId: text("active_organization_id")
        .references(() => workspaces.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    tokenIdx: index("sessions_token_idx").on(table.token),
}));

// Type exports for convenience
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;