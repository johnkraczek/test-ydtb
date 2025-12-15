import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/server/auth";

export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("[getSession] Session result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      sessionKeys: session ? Object.keys(session) : []
    });
    return session;
  } catch (error) {
    console.error("[getSession] Failed to get session:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
});

export const requireAuth = cache(async () => {
  const session = await getSession();
  console.log("[requireAuth] Session check:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email
  });
  if (!session) {
    console.error("[requireAuth] No session found");
    throw new Error("Authentication required");
  }
  return session;
});