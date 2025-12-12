'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardMainHeader } from "./headers/DashboardMainHeader";
import { DashboardPageHeader } from "./headers/DashboardPageHeader";
import { IconRail } from "./sidebars/IconRail";
import { ToolSidebar } from "./sidebars/ToolSidebar";
import { useThemePattern } from "~/hooks/use-theme-pattern";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTool?: string;
  header?: React.ReactNode;
  mode?: "client" | "agency";
  onToolSelect?: (toolId: string) => void;
}

export default function DashboardLayout({ children, activeTool: initialActiveTool = "home", header, onToolSelect }: DashboardLayoutProps) {
  const [activeTool, setActiveTool] = useState(initialActiveTool);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(true);
  const { themePattern } = useThemePattern();
  const router = useRouter();

  // Sync internal state with prop if it changes
  useEffect(() => {
    setActiveTool(initialActiveTool);
  }, [initialActiveTool]);

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);

    // Navigation using Next.js router
    switch (toolId) {
      case "home":
        router.push("/");
        break;
      case "agency-home":
        router.push("/agency");
        break;
      case "launchpad":
        router.push("/launchpad");
        break;
      case "users":
        router.push("/contacts");
        break;
      case "media":
        router.push("/media");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "automation":
        router.push("/automation");
        break;
      case "pages":
        router.push("/pages");
        break;
      case "sop":
        router.push("/sop");
        break;
      case "settings":
        router.push("/settings/account");
        break;
      case "agency-settings":
        router.push("/agency/settings/profile");
        break;
      case "agency-workspaces":
        router.push("/agency/workspaces");
        break;
      case "agency-templates":
        router.push("/agency/templates");
        break;
      default:
        // Notify parent of tool selection for custom navigation
        if (onToolSelect) {
          onToolSelect(toolId);
        }
        break;
    }
  };

  const getPatternClass = () => {
    if (activeTool === "messages") return "";
    switch (themePattern) {
      case "dots": return "bg-dot-pattern";
      case "grid": return "bg-grid-pattern";
      case "graph": return "bg-graph-paper";
      case "noise": return "bg-noise";
      default: return "";
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Main Header - Fixed at top */}
      <DashboardMainHeader />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70" />
        </div>

        {/* Icon Rail - Fixed left */}
        <IconRail
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          isToolSidebarOpen={isToolSidebarOpen}
          onToggleSidebar={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
        />

        {/* Collapsible Tool Sidebar + Main Content */}
        <div className={`flex flex-1 overflow-hidden p-2 ${isToolSidebarOpen ? "gap-2" : ""}`}>

          <ToolSidebar
            isOpen={isToolSidebarOpen}
            onToggle={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
            toolId={activeTool}
          />

          {/* Main Content Area */}
          <div className={`flex flex-1 flex-col overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 ${activeTool === "messages" ? "bg-white/0 border-none shadow-none backdrop-blur-none" : ""}`}>
            {/* Page Header */}
            {header ? header : (
              <DashboardPageHeader
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
                isBorderVisible={true}
              />
            )}

            {/* Main content scrollable area */}
            <div className={`flex-1 overflow-auto ${activeTool === "messages" ? "p-0" : "p-8"} ${getPatternClass()} ${activeTool !== "messages" ? "bg-slate-50/50 dark:bg-slate-900/50" : ""}`}>
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