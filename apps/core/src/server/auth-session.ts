import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/server/auth";

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to get session:", error);
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