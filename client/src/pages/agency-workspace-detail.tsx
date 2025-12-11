import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ExternalLink, 
  MoreHorizontal, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Users, 
  CreditCard, 
  BarChart2, 
  Settings, 
  Shield, 
  History,
  CheckCircle2,
  AlertCircle,
  Building,
  Key
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the workspace detail
const WORKSPACE_DATA = {
  id: 1,
  name: "5 Element Energy",
  status: "Active",
  type: "Business",
  address: "1037 S 650 W",
  city: "Farmington",
  state: "Utah",
  zip: "84025",
  country: "United States",
  timezone: "GMT-07:00 America/Denver (MST)",
  phone: "+1 801-828-0283",
  email: "contact@5element.com",
  website: "www.5elementenergy.com",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=5E",
  plan: "Pro Plan",
  users: 3,
  createdAt: "2023-05-15T10:00:00Z",
  revenue: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ]
};

export default function AgencyWorkspaceDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/agency/workspaces/:id");
  const id = params?.id;

  // In a real app, fetch data based on ID
  const workspace = WORKSPACE_DATA; 

  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-workspaces"
      header={
        <div className="flex flex-col gap-4 pb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={() => setLocation("/agency/workspaces")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspaces
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-xl border border-slate-200">
                <AvatarImage src={workspace.avatar} />
                <AvatarFallback className="rounded-xl text-lg">{workspace.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{workspace.name}</h1>
                  <Badge variant={workspace.status === 'Active' ? 'default' : 'secondary'}>
                    {workspace.status}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {workspace.address}, {workspace.city}, {workspace.state}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    {workspace.website}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Settings
              </Button>
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Login as User
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Workspace Settings
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Users & Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">+180 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,234</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={workspace.revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions performed in this workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New contact added", time: "2 hours ago", user: "Sarah W." },
                      { action: "Email campaign sent", time: "5 hours ago", user: "System" },
                      { action: "Payment received", time: "1 day ago", user: "Stripe" },
                      { action: "Settings updated", time: "2 days ago", user: "Mike T." },
                      { action: "User invitation sent", time: "3 days ago", user: "Sarah W." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="mt-0.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                          <History className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{item.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {item.user} • {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update the workspace's business details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ws-name">Business Name <span className="text-red-500">*</span></Label>
                      <Input id="ws-name" defaultValue={workspace.name} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ws-address">Street Address</Label>
                      <Input id="ws-address" defaultValue={workspace.address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ws-city">City</Label>
                        <Input id="ws-city" defaultValue={workspace.city} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ws-country">Country <span className="text-red-500">*</span></Label>
                        <Select defaultValue={workspace.country}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ws-zip">Zip / Postal Code</Label>
                        <Input id="ws-zip" defaultValue={workspace.zip} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ws-state">State / Prov / Region</Label>
                        <Input id="ws-state" defaultValue={workspace.state} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ws-website">Website</Label>
                      <Input id="ws-website" defaultValue={workspace.website} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ws-timezone">Time Zone</Label>
                      <Select defaultValue={workspace.timezone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Time Zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GMT-07:00 America/Denver (MST)">GMT-07:00 America/Denver (MST)</SelectItem>
                          <SelectItem value="GMT-05:00 America/New_York (EST)">GMT-05:00 America/New_York (EST)</SelectItem>
                          <SelectItem value="GMT-06:00 America/Chicago (CST)">GMT-06:00 America/Chicago (CST)</SelectItem>
                          <SelectItem value="GMT-08:00 America/Los_Angeles (PST)">GMT-08:00 America/Los_Angeles (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Active Status</Label>
                        <p className="text-xs text-muted-foreground">Enable or disable this workspace</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Auth</Label>
                        <p className="text-xs text-muted-foreground">Enforce 2FA for all users</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                      Reset Data
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Workspace
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                   <div>
                     <CardTitle>Workspace Users</CardTitle>
                     <CardDescription>Manage user access for this workspace.</CardDescription>
                   </div>
                   <Button size="sm" className="gap-2">
                     <Users className="h-4 w-4" />
                     Add User
                   </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((user) => (
                    <div key={user} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>U{user}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">User Name {user}</p>
                          <p className="text-xs text-muted-foreground">user{user}@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">Admin</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}