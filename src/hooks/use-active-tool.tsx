"use client";

import { usePathname } from "next/navigation";

// Route to tool ID mapping
const ROUTE_TO_TOOL: Record<string, string> = {
  "/dashboard": "home",
  "/dashboard/settings": "settings",
  "/dashboard/contacts": "users",
  "/dashboard/analytics": "analytics",
  "/dashboard/media": "media",
  "/dashboard/messages": "messages",
  "/dashboard/automation": "automation",
  "/dashboard/pages": "pages",
  "/dashboard/sop": "sop",
  "/agency": "agency-home",
  "/agency/settings/profile": "agency-settings",
  "/agency/workspaces": "agency-workspaces",
  "/agency/templates": "agency-templates",
  "/launchpad": "launchpad",
};

export function useActiveTool() {
  const pathname = usePathname();

  // Get the tool ID from the current route
  const activeTool = ROUTE_TO_TOOL[pathname] || "home";

  return activeTool;
}