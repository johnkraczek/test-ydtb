import { createTable } from "../utils";
import { index, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";

export const account = createTable("accounts", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    accountId: text("account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    providerAccountIdx: index("accounts_provider_account_idx").on(table.providerId, table.accountId),
}));

// Type exports for convenience
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;