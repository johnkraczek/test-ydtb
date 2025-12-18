import { createTable } from "../utils";
import { boolean, text, timestamp } from "drizzle-orm/pg-core";

export const user = createTable("users", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    image: text("image"),
    twoFactorEnabled: boolean("two_factor_enabled").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for convenience
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;