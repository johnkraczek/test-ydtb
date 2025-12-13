"use client";

import { useState, useEffect } from "react";
import { DashboardFooter } from "./DashboardFooter";
import { MainHeader } from "./headers/MainHeader";
import { ToolHeader } from "./headers/ToolHeader";
import { IconRail } from "./sidebars/IconRail";
import { ToolSidebar } from "./sidebars/ToolSidebar";
import { useThemePattern } from "~/context/theme/use-theme-pattern";
import { useSidebar } from "~/context/sidebar/use-sidebar";

interface DashboardClientProps {
  children: React.ReactNode;
  activeTool?: string;
  header?: React.ReactNode;
  mode?: "client" | "agency";
}

export function DashboardClient({
  children,
  activeTool: initialActiveTool = "home",
  header,
}: DashboardClientProps) {
  const [activeTool, setActiveTool] = useState(initialActiveTool);
  const { getPatternClass } = useThemePattern();
  const { isOpen: isToolSidebarOpen } = useSidebar();

  // Sync internal state with prop if it changes
  useEffect(() => {
    setActiveTool(initialActiveTool);
  }, [initialActiveTool]);

  return (
    <div className="flex h-screen flex-col bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Main Header - Fixed at top */}
      <MainHeader />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70" />
        </div>

        {/* Icon Rail - Fixed left */}
        <IconRail />

        {/* Collapsible Tool Sidebar + Main Content */}
        <div className={`flex flex-1 overflow-hidden p-2 ${isToolSidebarOpen ? "gap-2" : ""}`}>

          <ToolSidebar
            toolId={activeTool}
          />

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
            <div className={`flex-1 overflow-auto ${activeTool === "messages" ? "p-0" : "p-8"} ${getPatternClass(activeTool)} ${activeTool !== "messages" ? "bg-slate-50/50 dark:bg-slate-900/50" : ""}`}>
              {children}
            </div>

            {/* Footer */}
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}