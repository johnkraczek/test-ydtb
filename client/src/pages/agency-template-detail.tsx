import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  LayoutTemplate, 
  Mail, 
  Settings, 
  Check, 
  Copy, 
  MoreHorizontal,
  Calendar,
  User,
  Download,
  FileText,
  MessageSquare,
  Zap,
  Globe,
  Share2,
  PenLine
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for the template detail
const TEMPLATE_DATA = {
  id: 1,
  name: "Medical Spa Starter",
  type: "Snapshot",
  description: "Complete setup for Med Spas including intake forms, appointment reminders, and follow-up sequences. This snapshot includes everything you need to get a new Med Spa client up and running in minutes.",
  lastUpdated: "Oct 24, 2023",
  created: "Aug 15, 2023",
  author: "Agency Admin",
  usageCount: 12,
  tags: ["Health", "Beauty", "Service"],
  assets: {
    funnels: [
      { id: 1, name: "Consultation Booking", views: 1240, conversions: "12%" },
      { id: 2, name: "Special Offer Landing", views: 850, conversions: "8.5%" }
    ],
    campaigns: [
      { id: 1, name: "New Lead Nurture", steps: 5 },
      { id: 2, name: "Appointment Reminder", steps: 3 },
      { id: 3, name: "Review Request", steps: 2 }
    ],
    forms: [
      { id: 1, name: "Intake Form" },
      { id: 2, name: "Feedback Survey" }
    ],
    workflows: [
      { id: 1, name: "Auto-respond to Web Chat" },
      { id: 2, name: "Missed Call Text Back" },
      { id: 3, name: "Birthday Offer" }
    ]
  }
};

export default function AgencyTemplateDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/agency/templates/:id");
  const id = params?.id;

  // In a real app, fetch data based on ID
  const template = TEMPLATE_DATA;

  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-templates"
      header={
        <div className="flex flex-col gap-4 px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={() => setLocation("/agency/templates")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                {template.type === 'Snapshot' ? <LayoutTemplate className="h-8 w-8" /> : <Mail className="h-8 w-8" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{template.name}</h1>
                  <Badge variant="outline" className="text-xs font-normal">
                    {template.type}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Created by {template.author}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Updated {template.lastUpdated}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    {template.usageCount} Installs
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button className="gap-2">
                <Copy className="h-4 w-4" />
                Use Template
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <PenLine className="mr-2 h-4 w-4" /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
        <Tabs defaultValue="overview" className="w-full">
          <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:-mx-8 sm:px-8 -mt-8">
            <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent space-x-6">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="assets" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Assets Included
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Configuration
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">14</div>
                      <p className="text-xs text-muted-foreground mt-1">Items included in snapshot</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-500">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98%</div>
                      <p className="text-xs text-muted-foreground mt-1">Setup completion rate</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Copy className="h-4 w-4" />
                      Create New Workspace
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Snapshot Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Download className="h-4 w-4" />
                      Export Configuration
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Installs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium">
                            WS
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Workspace {i}</p>
                            <p className="text-xs text-slate-500">Installed 2 days ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Funnels & Websites</CardTitle>
                      <CardDescription>{template.assets.funnels.length} assets</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.assets.funnels.map(item => (
                      <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{item.views} views</span>
                          <span>{item.conversions} conv.</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Campaigns</CardTitle>
                      <CardDescription>{template.assets.campaigns.length} assets</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.assets.campaigns.map(item => (
                      <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.steps} steps</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Automations</CardTitle>
                      <CardDescription>{template.assets.workflows.length} assets</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.assets.workflows.map(item => (
                      <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <Badge variant="outline" className="text-[10px] h-5">Active</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Forms & Surveys</CardTitle>
                      <CardDescription>{template.assets.forms.length} assets</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.assets.forms.map(item => (
                      <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-slate-500">Standard</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Settings</CardTitle>
                <CardDescription>Default settings applied when using this snapshot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Custom Values</Label>
                    <p className="text-sm text-muted-foreground">Include custom values in snapshot</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Custom Fields</Label>
                    <p className="text-sm text-muted-foreground">Include custom contact fields</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Tags</Label>
                    <p className="text-sm text-muted-foreground">Include contact and opportunity tags</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label className="text-base">Pipelines</Label>
                    <p className="text-sm text-muted-foreground">Include opportunity pipelines and stages</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Calendars</Label>
                    <p className="text-sm text-muted-foreground">Include calendar configurations</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
