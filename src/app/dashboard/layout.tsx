"use client";

import { Providers } from "../../context/providers";
import { SidebarProvider } from "../../context/sidebar/use-sidebar";
import { DashboardLayout as DashboardLayoutComponent } from "../../components/dashboard/DashboardLayout";
import { IconRail } from "../../components/dashboard/sidebars/IconRail";
import { ToolSidebar } from "../../components/dashboard/sidebars/ToolSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Interactive Client Components - Fixed positioning */}
          <div className="fixed left-0 top-0 z-50 h-16">
            {/* Header will go here - but it's already in DashboardLayout */}
          </div>

          <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]">
            <IconRail />
          </div>

          <div className="fixed left-14 top-16 z-30 h-[calc(100vh-4rem)]">
            <ToolSidebar toolId="home" />
          </div>

          {/* Server Component - Main content area */}
          <div className="flex-1 ml-14">
            <DashboardLayoutComponent>
              {children}
            </DashboardLayoutComponent>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}