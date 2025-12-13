import { Providers } from "../../context/providers";
import { SidebarProvider } from "../../context/sidebar/use-sidebar";
import { DashboardClient } from "../../components/dashboard/DashboardClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <DashboardClient>
          {children}
        </DashboardClient>
      </SidebarProvider>
    </Providers>
  );
}