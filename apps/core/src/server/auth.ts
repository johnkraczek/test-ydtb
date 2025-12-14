import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { twoFactor } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import { env } from "@/env";
import { db } from "@/server/db";
import { user, session, account, verification, passkey, workspaces, workspaceMembers } from "@/server/db/schema";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      passkey,
      organization: workspaces,
      member: workspaceMembers,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      console.log("Password reset requested for:", user.email);
      console.log("Reset URL:", url);
      // TODO: Implement actual email sending
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    passkey({
      // Passkey configuration
      // Use default settings for WebAuthn
    }),
    twoFactor({
      // TOTP will be optional - users need to enable it
    }),
    organization({
      // Map our workspace schema to organization plugin
      schema: {
        organization: {
          tableName: "ydtb_workspaces",
          fields: {
            name: "name",
            slug: "slug",
            logo: "logo",
            metadata: "metadata",
          },
        },
        member: {
          tableName: "ydtb_workspace_members",
          fields: {
            organizationId: "workspaceId",
            userId: "userId",
            role: "role",
            status: "status",
          },
        },
      },
      allowUserToCreateOrganization: true,
    }),
  ],
});