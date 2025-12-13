import { Providers } from "../../context/providers";
import { DashboardClient } from "../../components/dashboard/DashboardClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <DashboardClient>
        {children}
      </DashboardClient>
    </Providers>
  );
}