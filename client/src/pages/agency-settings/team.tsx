
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AgencyTeamPage() {
  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-settings"
      header={
        <DashboardPageHeader 
          title="Team Management" 
          description="Manage who has access to your agency dashboard."
          hideBreadcrumbs={true}
          actions={<div />}
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
           <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <CardTitle className="text-lg">Team Members</CardTitle>
                    <CardDescription>Manage who has access to your agency dashboard.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">Team management features coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
