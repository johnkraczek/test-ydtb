"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// TODO: SessionProvider needs to be properly implemented
// This is a temporary wrapper that just renders children
export function SessionProvider({ children }: Props) {
  return <>{children}</>;
}