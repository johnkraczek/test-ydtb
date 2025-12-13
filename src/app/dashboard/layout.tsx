import { Providers } from "../../context/providers";
import { SidebarProvider } from "../../context/sidebar/use-sidebar";
import { MainHeader } from "../../components/dashboard/headers/MainHeader";
import { DynamicContent } from "../../components/dashboard/DynamicContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="flex h-screen flex-col bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
          {/* Main Header - Fixed at top */}
          <MainHeader />

          <div className="flex flex-1 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70" />
              <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70" />
            </div>

            {/* Dynamic content that needs client-side state */}
            <DynamicContent>
              {children}
            </DynamicContent>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}