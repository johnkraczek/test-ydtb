import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { twoFactor } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import { env } from "@/env";
import { db } from "@/server/db";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
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
      appName: "YDTB",
      // TOTP will be optional - users need to enable it
    }),
    // Temporarily comment out organization plugin to avoid build issues
    // organization({
    //   // Map our workspace schema to organization plugin
    //   schema: {
    //     organization: {
    //       tableName: "workspaces",
    //       fields: {
    //         name: "name",
    //         slug: "slug",
    //         logo: "logo",
    //         metadata: "metadata",
    //       },
    //     },
    //     member: {
    //       tableName: "workspace_members",
    //       fields: {
    //         organizationId: "workspaceId",
    //         userId: "userId",
    //         role: "role",
    //         status: "status",
    //       },
    //     },
    //   },
    //   allowUserToCreateOrganization: true,
    // }),
  ],
});