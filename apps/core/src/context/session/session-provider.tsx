"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  const { isPending, error } = useSession();

  useEffect(() => {
    if (error) {
      console.error("Session error:", error);
    }
  }, [error]);

  if (isPending) {
    // Optionally show a loading indicator while checking session
    return <>{children}</>;
  }

  return <>{children}</>;
}