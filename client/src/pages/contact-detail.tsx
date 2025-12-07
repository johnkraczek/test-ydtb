import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  MapPin,
  Building,
  Tag,
  Clock,
  Trash2,
  Edit,
  Star,
  Ban,
  PhoneIncoming,
  MessageCircle,
  History,
  CheckSquare
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { format } from "date-fns";

export default function ContactDetailPage() {
  const [, params] = useRoute("/contacts/:id");
  const id = params?.id;

  // Mock contact data - in a real app this would come from an API/store
  const contact = {
    id: id || "1",
    name: "Alice Johnson",
    initials: "AJ",
    email: "alice.johnson@example.com",
    phone: "+1 (555) 000-1234",
    role: "Marketing Manager",
    company: "Acme Corp",
    address: "123 Market St, San Francisco, CA 94105",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice%20Johnson",
    created: new Date(),
    lastActive: new Date(),
    dob: new Date(1990, 5, 15),
    source: "Website",
    type: "Customer",
    tags: ["VIP", "Customer", "Lead"],
    about: "Alice is a key stakeholder for the upcoming project. She has been with Acme Corp for 5 years and manages a team of 10. Preferred communication method is email.",
    dnd: {
      email: false,
      sms: true,
      call: false,
      inboundCall: false,
      inboundSms: true
    }
  };

  return (
    <DashboardLayout activeTool="users">
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/contacts" className="hover:text-primary transition-colors">Contacts</Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-slate-900 dark:text-slate-100 font-medium">{contact.name}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-sm bg-primary/10 text-primary">
                <AvatarImage src={contact.image} />
                <AvatarFallback className="text-xl font-semibold">{contact.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {contact.name}
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </h1>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span>{contact.role}</span>
                  <span>•</span>
                  <span>{contact.company}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-none p-0 gap-6">
                <TabsTrigger 
                  value="overview" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 font-medium"
                >
                  Tasks
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="overview" className="space-y-6">
                  {/* About Card */}
                  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {contact.about}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Building className="h-4 w-4 text-slate-400" />
                          Company Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Company Name</span>
                          <p className="text-sm font-medium">{contact.company}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Role</span>
                          <p className="text-sm font-medium">{contact.role}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Address</span>
                          <p className="text-sm font-medium">{contact.address}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Tag className="h-4 w-4 text-slate-400" />
                          Segmentation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Type</span>
                          <p className="text-sm font-medium">{contact.type}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Source</span>
                          <p className="text-sm font-medium">{contact.source}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tags</span>
                          <div className="flex flex-wrap gap-2">
                            {contact.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <History className="h-5 w-5 text-slate-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
                        <div className="relative">
                          <div className="absolute -left-[31px] bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-full border-4 border-white dark:border-slate-900">
                            <PhoneIncoming className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Inbound Call from Alice</p>
                            <p className="text-xs text-slate-500">Today at 10:30 AM • Duration: 5m 23s</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Discussed project requirements and timeline for Q4.</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[31px] bg-purple-100 dark:bg-purple-900/20 p-1.5 rounded-full border-4 border-white dark:border-slate-900">
                            <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Email Sent: Welcome Aboard</p>
                            <p className="text-xs text-slate-500">Yesterday at 2:15 PM</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[31px] bg-green-100 dark:bg-green-900/20 p-1.5 rounded-full border-4 border-white dark:border-slate-900">
                            <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Task Completed: Initial Setup</p>
                            <p className="text-xs text-slate-500">Oct 24, 2023</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks">
                  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <CheckSquare className="h-5 w-5 text-slate-400" />
                          Tasks
                        </CardTitle>
                        <Button size="sm" variant="outline" className="h-8 gap-2">
                          <Plus className="h-3.5 w-3.5" />
                          Add Task
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <Checkbox id="task1" />
                          <div className="space-y-1">
                            <Label htmlFor="task1" className="text-sm font-medium leading-none cursor-pointer">Follow up on proposal</Label>
                            <p className="text-xs text-slate-500">Due tomorrow at 5:00 PM</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <Checkbox id="task2" defaultChecked />
                          <div className="space-y-1">
                            <Label htmlFor="task2" className="text-sm font-medium leading-none cursor-pointer line-through text-slate-500">Send onboarding docs</Label>
                            <p className="text-xs text-slate-500">Completed yesterday</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar - Info */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-slate-500 uppercase font-medium">Email</p>
                    <p className="text-sm font-medium truncate">{contact.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Phone</p>
                    <p className="text-sm font-medium">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Location</p>
                    <p className="text-sm font-medium">San Francisco, CA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Date of Birth</p>
                    <p className="text-sm font-medium">{format(contact.dob, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Ban className="h-4 w-4 text-slate-400" />
                  Do Not Disturb (DND)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-email" className="text-sm font-medium">Email</Label>
                  <Switch id="dnd-email" checked={contact.dnd.email} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-sms" className="text-sm font-medium">SMS</Label>
                  <Switch id="dnd-sms" checked={contact.dnd.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-call" className="text-sm font-medium">Calls</Label>
                  <Switch id="dnd-call" checked={contact.dnd.call} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-inbound-call" className="text-sm font-medium">Inbound Calls</Label>
                  <Switch id="dnd-inbound-call" checked={contact.dnd.inboundCall} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-inbound-sms" className="text-sm font-medium">Inbound SMS</Label>
                  <Switch id="dnd-inbound-sms" checked={contact.dnd.inboundSms} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
