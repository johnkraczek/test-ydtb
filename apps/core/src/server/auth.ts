import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { twoFactor } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins";
import { env } from "@/env";
import { db } from "@/server/db";
import { user, session, account, verification, passkey as passkeyTable, workspaces, workspaceMembers, invitation } from "@/server/db/schema";
import { sendVerificationOTP } from "./auth/email-sender";
import { eq } from "drizzle-orm";

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
      passkey: passkeyTable,
      organization: workspaces,
      member: workspaceMembers,
      invitation,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
      allowUserToCreateOrganization: true,
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        // Get user info from database for name
        const userRecord = await db.select().from(user).where(eq(user.email, email)).limit(1);

        await sendVerificationOTP({
          email,
          otp,
          userName: userRecord[0]?.name || undefined,
        });
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
      storeOTP: "hashed",
    }),
  ],
});