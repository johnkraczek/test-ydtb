import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@ydtb/core/server/auth";

export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
});

export const requireAuth = cache(async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
});