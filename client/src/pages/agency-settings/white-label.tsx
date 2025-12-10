
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Mail } from "lucide-react";

export default function AgencyWhiteLabelPage() {
  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-settings"
      header={
        <DashboardPageHeader 
          title="White Label" 
          description="Customize the branding for your sub-accounts."
          hideBreadcrumbs={true}
          actions={<div />}
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
         <Card>
           <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <CardTitle className="text-lg">White Label Settings</CardTitle>
                    <CardDescription>Customize the branding for your sub-accounts.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Custom Domain</Label>
                    <p className="text-sm text-slate-500">Use your own domain for the client portal.</p>
                </div>
                <Switch />
             </div>
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Remove "Powered By"</Label>
                    <p className="text-sm text-slate-500">Hide the platform branding from footers.</p>
                </div>
                <Switch />
             </div>
             <div className="space-y-2 pt-2">
                <Label>Custom Support Email</Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                         <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                         <Input className="pl-9" placeholder="support@youragency.com" />
                    </div>
                </div>
             </div>
             <div className="flex justify-end pt-2">
              <Button>Save Branding</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
