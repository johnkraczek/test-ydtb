
import DashboardLayout from "~/components/dashboard/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Switch } from "~/components/ui/switch";
import { Building, CreditCard, Users, Globe, Mail } from "lucide-react";

export default function AgencySettingsPage() {
  return (
    <DashboardLayout mode="agency" activeTool="agency-settings">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Agency Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your agency profile, team, and billing.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 bg-transparent p-0 rounded-none h-auto">
            <TabsTrigger
              value="profile"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
            >
              Agency Profile
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
            >
              Team Management
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="white-label"
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent"
            >
              White Label
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
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
          </TabsContent>

          <TabsContent value="team" className="mt-6">
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
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
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
          </TabsContent>

          <TabsContent value="white-label" className="mt-6 space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
