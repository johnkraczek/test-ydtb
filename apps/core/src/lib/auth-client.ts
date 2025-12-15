import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import { organizationClient } from "better-auth/client/plugins";
// import { twoFactorClient } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [passkeyClient(), organizationClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

// Check if twoFactor methods are available
// export const twoFactor = authClient.twoFactor;

// forgotPassword - manual implementation since better-auth doesn't export it directly
export const forgotPassword = async ({ email, redirectTo }: { email: string; redirectTo: string }) => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      redirectTo,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send reset email');
  }

  return response;
};

// resetPassword - manual implementation
export const resetPassword = async ({ newPassword, token }: { newPassword: string; token: string }) => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newPassword,
      token,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to reset password');
  }

  return data;
};

// Organization type definition
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
}

export type Session = typeof authClient.$Infer.Session;