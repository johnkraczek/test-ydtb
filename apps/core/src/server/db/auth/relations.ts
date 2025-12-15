import { relations } from "drizzle-orm";
import { user } from "./users";
import { session } from "./sessions";
import { account } from "./accounts";
import { passkey } from "./passkeys";

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    passkeys: many(passkey),
    // workspaceMembers relation moved to cross-domain relations to avoid circular dependency
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
    // activeOrganization relation moved to cross-domain relations to avoid circular dependency
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