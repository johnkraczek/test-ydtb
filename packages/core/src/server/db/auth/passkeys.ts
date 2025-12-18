import { createTable } from "../utils";
import { boolean, index, integer, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";

export const passkey = createTable("passkeys", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    credentialId: text("credential_id").notNull().unique(),
    counter: integer("counter").notNull().default(0),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull().default(false),
    transports: text("transports"),
    createdAt: timestamp("created_at").defaultNow(),
    aaguid: text("aaguid"),
}, (table) => ({
    credentialIdIdx: index("passkeys_credential_id_idx").on(table.credentialId),
}));

// Type exports for convenience
export type Passkey = typeof passkey.$inferSelect;
export type NewPasskey = typeof passkey.$inferInsert;