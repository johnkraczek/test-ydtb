import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    jsonb,
    pgTableCreator,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Use pgTableCreator for consistent ydtb_ prefix
export const createTable = pgTableCreator((name) => `ydtb_${name}`);

// Better-auth tables
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

export const session = createTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    activeOrganizationId: varchar("active_organization_id", { length: 20 })
        .references(() => workspaces.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    tokenIdx: index("sessions_token_idx").on(table.token),
}));

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

export const verification = createTable("verifications", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

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

// Workspaces table - core multi-tenancy
export const workspaces = createTable("workspaces", {
    id: varchar("id", { length: 20 }).primaryKey(), // 10-20 alphanumeric for URL-friendly IDs
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

// Workspace members table - links users to workspaces
export const workspaceMembers = createTable("workspace_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: varchar("workspace_id", { length: 20 })
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member', 'guest'] })
        .notNull()
        .default('member'),
    status: varchar("status", { length: 50 }).default('active'),
    joinedAt: timestamp("joined_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    workspaceUserIdx: index("workspace_members_workspace_user_idx").on(table.workspaceId, table.userId),
}));

// Auth relations
export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    passkeys: many(passkey),
    workspaceMembers: many(workspaceMembers),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
    activeOrganization: one(workspaces, {
        fields: [session.activeOrganizationId],
        references: [workspaces.id],
        relationName: "activeOrganization",
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
    user: one(user, {
        fields: [passkey.userId],
        references: [user.id],
    }),
}));

// Workspace relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
    members: many(workspaceMembers),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId],
        references: [workspaces.id],
    }),
    user: one(user, {
        fields: [workspaceMembers.userId],
        references: [user.id],
    }),
}));

// Type exports for convenience
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Passkey = typeof passkey.$inferSelect;
export type NewPasskey = typeof passkey.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;