
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardMainHeader } from "./headers/DashboardMainHeader";
import { DashboardPageHeader } from "./headers/DashboardPageHeader";
import { ToolIconsSidebar } from "./sidebars/ToolIconsSidebar";
import { ToolSidebar } from "./sidebars/ToolSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTool?: string;
  header?: React.ReactNode;
}

export default function DashboardLayout({ children, activeTool: initialActiveTool = "home", header }: DashboardLayoutProps) {
  const [activeTool, setActiveTool] = useState(initialActiveTool);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(true);
  const [location, setLocation] = useLocation();

  // Sync internal state with prop if it changes
  useEffect(() => {
    setActiveTool(initialActiveTool);
  }, [initialActiveTool]);

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    
    // Simple routing based on tool ID
    if (toolId === "home") {
      setLocation("/");
    } else if (toolId === "users") {
      setLocation("/contacts");
    } else if (toolId === "media") {
      setLocation("/media");
    } else if (toolId === "messages") {
      setLocation("/messages");
    }
    // Add other routes as needed
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
              <div className={`flex-1 overflow-auto ${activeTool === "messages" ? "p-0" : "p-8"}`}>
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
