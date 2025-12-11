import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  LayoutTemplate, 
  FileBox, 
  Mail, 
  MessageSquare, 
  Calendar,
  Settings,
  Copy,
  Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_TEMPLATES = [
  {
    id: 1,
    name: "Medical Spa Starter",
    type: "Snapshot",
    description: "Complete setup for Med Spas including intake forms, appointment reminders, and follow-up sequences.",
    lastUpdated: "2 days ago",
    usageCount: 12,
    tags: ["Health", "Beauty", "Service"]
  },
  {
    id: 2,
    name: "Real Estate Lead Gen",
    type: "Snapshot",
    description: "Landing pages, email nurture sequences, and SMS automation for real estate agents.",
    lastUpdated: "1 week ago",
    usageCount: 45,
    tags: ["Real Estate", "Sales"]
  },
  {
    id: 3,
    name: "Restaurant Reservation",
    type: "Campaign",
    description: "Email and SMS campaign for confirming reservations and requesting reviews.",
    lastUpdated: "3 weeks ago",
    usageCount: 8,
    tags: ["Food", "Hospitality"]
  },
  {
    id: 4,
    name: "Gym Membership Onboarding",
    type: "Snapshot",
    description: "New member welcome packet, waiver forms, and 30-day challenge email sequence.",
    lastUpdated: "1 month ago",
    usageCount: 23,
    tags: ["Fitness", "Membership"]
  }
];

export default function AgencyTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = MOCK_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout mode="agency" activeTool="agency-templates">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Templates</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Create and manage snapshots to deploy settings across sub-accounts.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search templates..." 
              className="pl-9 bg-white dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950">
              <Settings className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6 mb-6">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              All Templates
            </TabsTrigger>
            <TabsTrigger 
              value="snapshots" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Snapshots
            </TabsTrigger>
            <TabsTrigger 
              value="campaigns" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
            >
              Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                        {template.type === 'Snapshot' ? <LayoutTemplate className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-base font-semibold line-clamp-1">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-200 border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 border-t bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 flex justify-between">
                    <span>Updated {template.lastUpdated}</span>
                    <span>{template.usageCount} Installs</span>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Create New Card */}
              <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 h-full min-h-[220px]">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-900 shadow-sm">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Create Template</h3>
                  <p className="text-xs mt-1">Build a new snapshot from scratch</p>
                </div>
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
