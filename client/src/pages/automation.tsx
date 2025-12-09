
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";

export default function AutomationPage() {
  return (
    <DashboardLayout 
      activeTool="automation"
      header={
        <DashboardPageHeader
          title="Automation"
          description="Manage your automation workflows."
        />
      }
    >
      <div className="h-full w-full">
        {/* Content removed as requested */}
      </div>
    </DashboardLayout>
  );
}
