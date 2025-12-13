import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "~/context/providers";
import { SidebarProvider } from "~/context/sidebar/use-sidebar";
import { MainHeader } from "~/components/dashboard/headers/MainHeader";
import { IconRail } from "~/components/dashboard/sidebars/IconRail";
import { ToolSidebar } from "~/components/dashboard/sidebars/ToolSidebar";
import { ToolHeader } from "~/components/dashboard/headers/ToolHeader";
import { DashboardFooter } from "~/components/dashboard/DashboardFooter";
import '~/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM Toolbox',
  description: 'A modern CRM toolbox for professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
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
                      <div className="flex-1 overflow-auto p-8 bg-slate-50/50 dark:bg-slate-900/50">
                        {children}
                      </div>
                      <DashboardFooter />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}