
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";

export default function AgencyProfilePage() {
  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-profile"
      header={
        <DashboardPageHeader 
          title="Agency Profile" 
          description="Manage your agency profile and contact info."
          hideBreadcrumbs={true}
          actions={<div />} // Empty div to remove default actions
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <CardTitle className="text-lg">Agency Details</CardTitle>
                    <CardDescription>Update your agency's public profile and contact info.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input id="agency-name" defaultValue="Acme Agency" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency-email">Contact Email</Label>
                <Input id="agency-email" defaultValue="contact@acme.agency" />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agency-phone">Phone Number</Label>
                <Input id="agency-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency-website">Website</Label>
                <Input id="agency-website" defaultValue="https://acme.agency" />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="agency-address">Address</Label>
                <Input id="agency-address" defaultValue="123 Agency Blvd, Suite 100" />
              </div>
            <div className="flex justify-end pt-4">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
