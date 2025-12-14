"use client";

import { SessionProvider as BetterAuthSessionProvider } from "better-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  return <BetterAuthSessionProvider>{children}</BetterAuthSessionProvider>;
}