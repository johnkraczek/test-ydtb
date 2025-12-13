"use client";

import { usePathname } from "next/navigation";

export function useActiveTool(): string {
  const pathname = usePathname();

  // Extract the tool ID from the current pathname
  // / -> "home"
  // /contacts -> "contacts"
  // /analytics -> "analytics"
  // /settings -> "settings"
  if (pathname === "/") {
    return "home";
  }

  const segments = pathname.split("/");
  const toolId = segments[segments.length - 1];

  return toolId || "home";
}