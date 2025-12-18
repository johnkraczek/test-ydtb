import { createTable } from "../utils";
import { jsonb, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const workspaces = createTable("workspaces", {
    id: text("id").primaryKey(), // Better Auth generates longer IDs
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    metadata: jsonb("metadata").$default(() => ({})),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

// Type exports for convenience
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;