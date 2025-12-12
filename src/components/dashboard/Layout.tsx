
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardMainHeader } from "./headers/DashboardMainHeader";
import { DashboardPageHeader } from "./headers/DashboardPageHeader";
import { ToolIconsSidebar } from "./sidebars/ToolIconsSidebar";
import { ToolSidebar } from "./sidebars/ToolSidebar";
import { useThemePattern } from "~/hooks/use-theme-pattern";
import { ContactEditDrawer } from "./ContactEditDrawer";
import { useToast } from "~/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTool?: string;
  header?: React.ReactNode;
  mode?: "client" | "agency";
}

export default function DashboardLayout({ children, activeTool: initialActiveTool = "home", header, mode = "client" }: DashboardLayoutProps) {
  const [activeTool, setActiveTool] = useState(initialActiveTool);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(true);
  const [location, setLocation] = useLocation();
  const { themePattern } = useThemePattern();
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const { toast } = useToast();

  // Sync internal state with prop if it changes
  useEffect(() => {
    setActiveTool(initialActiveTool);
  }, [initialActiveTool]);

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);

    // Simple routing based on tool ID
    if (toolId === "home") {
      setLocation("/");
    } else if (toolId === "agency-home") {
      setLocation("/agency");
    } else if (toolId === "launchpad") {
      setLocation("/launchpad");
    } else if (toolId === "users") {
      setLocation("/contacts");
    } else if (toolId === "media") {
      setLocation("/media");
    } else if (toolId === "messages") {
      setLocation("/messages");
    } else if (toolId === "automation") {
      setLocation("/automation");
    } else if (toolId === "pages") {
      setLocation("/pages");
    } else if (toolId === "sop") {
      setLocation("/sop");
    } else if (toolId === "settings") {
      // Default to account if clicking the setting icon, or keep current if already in settings
      if (!location.startsWith("/settings")) {
        setLocation("/settings/account");
      }
    } else if (toolId === "agency-settings") {
      setLocation("/agency/settings/profile"); // Default to profile if someone clicks settings
    } else if (toolId === "agency-workspaces") {
      setLocation("/agency/workspaces");
    } else if (toolId === "agency-templates") {
      setLocation("/agency/templates");
    }
    // Add other routes as needed
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

        {/* Tool Icons Sidebar - Fixed left */}
        <ToolIconsSidebar
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          isToolSidebarOpen={isToolSidebarOpen}
          onToggleSidebar={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
          mode={mode}
        />

        {/* Collapsible Tool Sidebar + Main Content */}
        <div className={`flex flex-1 overflow-hidden p-2 ${isToolSidebarOpen ? "gap-2" : ""}`}>

          <ToolSidebar
            isOpen={isToolSidebarOpen}
            onToggle={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
            toolId={activeTool}
            onCreateClick={() => {
              if (activeTool === "users") {
                setIsCreateContactOpen(true);
              }
            }}
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

      <ContactEditDrawer
        open={isCreateContactOpen}
        onOpenChange={setIsCreateContactOpen}
        contact={{}}
        onSave={(data) => {
          toast({
            title: "Contact Created",
            description: `${data.firstName || 'New contact'} has been added successfully.`
          });
          setIsCreateContactOpen(false);
        }}
      />
    </div>
  );
}
