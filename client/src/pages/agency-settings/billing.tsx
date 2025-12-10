
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function AgencyBillingPage() {
  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-billing"
      header={
        <DashboardPageHeader 
          title="Billing" 
          description="Manage your agency subscription plan."
          hideBreadcrumbs={true}
          actions={<div />}
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
         <Card>
           <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <CardTitle className="text-lg">Subscription & Billing</CardTitle>
                    <CardDescription>Manage your agency subscription plan.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="font-medium">Billing management features coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
