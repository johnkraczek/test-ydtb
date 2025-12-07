import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckSquare,
  Plus,
  StickyNote,
  CreditCard,
  Ticket,
  UserPlus,
  Eye,
  MousePointerClick
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { format, formatDistanceToNow } from "date-fns";

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

  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "note",
      direction: "outbound",
      title: "ADDED NOTE",
      description: "Customer prefers booth seating near the window.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 3 months ago
      icon: StickyNote,
    },
    {
      id: "2",
      type: "review",
      direction: "inbound",
      title: "LEFT 5-STAR REVIEW",
      description: '"Amazing service and the gluten free pasta was incredible!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 2 months ago
      icon: Star,
      metadata: { rating: 5, label: "Rating: 5/5" }
    },
    {
      id: "3",
      type: "profile",
      direction: "outbound",
      title: "UPDATED PROFILE",
      description: "Updated dietary restrictions: Gluten Free.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 2 months ago
      icon: Edit,
    },
    {
      id: "4",
      type: "tag",
      direction: "outbound",
      title: "ADDED TAG",
      description: 'Added tag "Wine Lover" based on purchase history.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
      icon: Tag,
    },
    {
      id: "5",
      type: "email",
      direction: "outbound",
      title: "SENT SPECIAL OFFER",
      description: 'Sent "Free Dessert" offer for birthday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
      icon: Mail,
      metadata: { label: "Expires in 30 days" }
    },
    {
      id: "6",
      type: "sms",
      direction: "outbound",
      title: "SENT SMS CAMPAIGN",
      description: "Hey Alice! Come in this week for double points on all entrees.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), // 3 weeks ago
      icon: MessageSquare,
    },
    {
      id: "7",
      type: "loyalty",
      direction: "inbound",
      title: "LOYALTY CARD ACTIVATED",
      description: "Customer activated digital loyalty card.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
      icon: CreditCard,
    },
    {
      id: "8",
      type: "page_view",
      direction: "inbound",
      title: "PAGE VIEW",
      description: "Visited 'Menu' page on website.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      icon: Eye,
    },
    {
      id: "9",
      type: "trigger_link",
      direction: "inbound",
      title: "TRIGGER LINK CLICKED",
      description: "Clicked 'View Menu' link in SMS.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
      icon: MousePointerClick,
    },
    {
      id: "10",
      type: "signup",
      direction: "inbound",
      title: "NEW SIGNUP",
      description: "Signed up for weekly newsletter.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
      icon: UserPlus,
    },
    {
      id: "11",
      type: "loyalty_checkin",
      direction: "inbound",
      title: "LOYALTY CHECK-IN",
      description: "Earned 45 points.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      icon: MapPin,
    },
    {
      id: "12",
      type: "coupon",
      direction: "inbound",
      title: "REDEEMED COUPON",
      description: 'Used "Free Appetizer" coupon with main course order.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      icon: Ticket,
      metadata: { label: "Ticket Value: $45.20" }
    },
  ];

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
                  <div className="space-y-6 p-1">
                    {activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`flex w-full ${activity.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-4 max-w-[80%] ${activity.direction === 'inbound' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Icon Bubble */}
                          <div className={`
                            flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm z-10
                            ${activity.direction === 'inbound' 
                              ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400' 
                              : 'bg-primary text-primary-foreground'}
                          `}>
                            <activity.icon className="h-5 w-5" />
                          </div>

                          {/* Content Card */}
                          <div className={`
                            relative p-4 rounded-xl shadow-sm border
                            ${activity.direction === 'inbound' 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'}
                          `}>
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className={`text-xs font-bold uppercase tracking-wider ${activity.direction === 'inbound' ? 'text-primary-foreground/90' : 'text-primary'}`}>
                                {activity.title}
                              </span>
                              <span className={`text-xs ${activity.direction === 'inbound' ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            
                            <p className={`text-sm leading-relaxed ${activity.direction === 'inbound' ? 'text-primary-foreground/90' : 'text-slate-600 dark:text-slate-400'}`}>
                              {activity.description}
                            </p>

                            {activity.metadata && (
                              <div className="mt-3">
                                <Badge 
                                  variant="secondary" 
                                  className={`
                                    font-mono text-xs
                                    ${activity.direction === 'inbound' 
                                      ? 'bg-white/20 text-primary-foreground hover:bg-white/30 border-transparent' 
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}
                                  `}
                                >
                                  {activity.metadata.label}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
