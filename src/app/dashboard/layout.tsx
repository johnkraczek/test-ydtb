import { Providers } from "../providers";
import { DashboardClient } from "./components/DashboardClient";

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