import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { getUserWorkspaces } from "@/server/actions/workspace";
import { SidebarProvider } from "~/context/sidebar/use-sidebar";
import { MainHeader } from "~/components/dashboard/headers/MainHeader";
import { IconRail } from "~/components/dashboard/sidebars/IconRail";
import { ToolSidebar } from "~/components/dashboard/sidebars/ToolSidebar";
import { ToolHeader } from "~/components/dashboard/headers/ToolHeader";
import { DashboardFooter } from "~/components/dashboard/DashboardFooter";
import { ThemedContentArea } from "~/components/ThemedContentArea";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Check if email is verified
  if (!session.user.emailVerified) {
    redirect(`/verify-otp?email=${encodeURIComponent(session.user.email)}&fromDashboard=true`);
  }

  // Check if user has workspaces
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) {
    redirect("/welcome");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
        <MainHeader />
        <div className="flex flex-1 overflow-hidden relative">
          <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70" />
          </div>

          {/* Icon Rail and Main Content Container */}
          <div className="flex flex-1 overflow-hidden">
            <IconRail />

            {/* Tool Sidebar and Main Content */}
            <div className="flex flex-1 overflow-hidden p-2">
              <ToolSidebar />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300">
                <ToolHeader />
                <div className="flex-1 overflow-auto">
                  <ThemedContentArea>
                    {children}
                  </ThemedContentArea>
                </div>
                <DashboardFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}