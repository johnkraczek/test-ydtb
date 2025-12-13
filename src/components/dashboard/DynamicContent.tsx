"use client";

import { useActiveTool } from "~/hooks/use-active-tool";
import { useSidebar } from "~/context/sidebar/use-sidebar";
import { IconRail } from "./sidebars/IconRail";
import { ToolSidebar } from "./sidebars/ToolSidebar";
import { ToolHeader } from "./headers/ToolHeader";
import { DashboardFooter } from "./DashboardFooter";

interface DynamicContentProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function DynamicContent({ children, header }: DynamicContentProps) {
  const activeTool = useActiveTool();
  const { isOpen: isToolSidebarOpen } = useSidebar();

  return (
    <>
      {/* Icon Rail - Fixed left */}
      <IconRail />

      {/* Collapsible Tool Sidebar + Main Content */}
      <div className={`flex flex-1 overflow-hidden p-2 ${isToolSidebarOpen ? "gap-2" : ""}`}>
        <ToolSidebar toolId={activeTool} />

        {/* Main Content Area */}
        <div className={`flex flex-1 flex-col overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 ${activeTool === "messages" ? "bg-white/0 border-none shadow-none backdrop-blur-none" : ""}`}>
          {/* Page Header */}
          {header ? header : (
            <ToolHeader
              description={
                activeTool === "users" ? "Manage your team and contacts." :
                  activeTool === "media" ? "Manage and organize your media assets." :
                    "Here's what's happening with your projects today."
              }
              title={
                activeTool === "users" ? "Contacts" :
                  activeTool === "media" ? "Media Storage" :
                    "Dashboard"
              }
            />
          )}

          {/* Main content scrollable area */}
          <div className={`flex-1 overflow-auto p-8 ${activeTool !== "messages" ? "bg-slate-50/50 dark:bg-slate-900/50" : ""}`}>
            {children}
          </div>

          {/* Footer */}
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}