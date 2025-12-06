
import { useState } from "react";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardMainHeader } from "./headers/DashboardMainHeader";
import { DashboardPageHeader } from "./headers/DashboardPageHeader";
import { ToolIconsSidebar } from "./sidebars/ToolIconsSidebar";
import { ToolSidebar } from "./sidebars/ToolSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTool, setActiveTool] = useState("home");
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(true);

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
          onToolSelect={setActiveTool}
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
            <div className={`flex flex-1 flex-col overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300`}>
              {/* Page Header */}
              <DashboardPageHeader
                description="Here's what's happening with your projects today."
                title="Dashboard"
                isBorderVisible={true}
              />

              {/* Main content scrollable area */}
              <div className="flex-1 overflow-auto p-8">
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
