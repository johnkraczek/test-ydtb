
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  MapPin, 
  Users, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Star, 
  BarChart2,
  ExternalLink,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for workspaces
const WORKSPACES = [
  {
    id: 1,
    name: "5 Element Energy",
    status: "Active",
    address: "1037 S 650 W, Salt Lake City, UT",
    phone: "+1 801-828-0283",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=5E",
    metrics: {
      activeUsers: { value: 3, change: "0%" },
      calls: { value: 124, change: "+12%" },
      emails: { value: 854, change: "+5%" },
      texts: { value: 45, change: "-2%" },
      contacts: { value: 1250, change: "+15%" },
      appointments: { value: 12, change: "+20%" },
      reviews: { value: 4.8, count: 24 }
    },
    revenue: "$9,999.00",
    features: ["sms", "email", "calls", "reviews", "payments"]
  },
  {
    id: 2,
    name: "Air Granted",
    status: "Active",
    address: "420 South 1350 East, Provo, UT",
    phone: "+1 555-706-3993",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AG",
    metrics: {
      activeUsers: { value: 5, change: "+2%" },
      calls: { value: 89, change: "-5%" },
      emails: { value: 1205, change: "+18%" },
      texts: { value: 120, change: "+8%" },
      contacts: { value: 3400, change: "+4%" },
      appointments: { value: 28, change: "+10%" },
      reviews: { value: 4.9, count: 156 }
    },
    revenue: "$12,450.00",
    features: ["sms", "email", "calls", "reviews", "payments", "ads"]
  },
  {
    id: 3,
    name: "Zenith Fitness",
    status: "Trial",
    address: "880 Harrison Blvd, Ogden, UT",
    phone: "+1 801-555-0199",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ZF",
    metrics: {
      activeUsers: { value: 1, change: "0%" },
      calls: { value: 12, change: "+100%" },
      emails: { value: 45, change: "+100%" },
      texts: { value: 5, change: "+100%" },
      contacts: { value: 120, change: "+100%" },
      appointments: { value: 4, change: "+100%" },
      reviews: { value: 0, count: 0 }
    },
    revenue: "$0.00",
    features: ["sms", "email", "calls"]
  }
];

export default function AgencyWorkspacesPage() {
  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-workspaces"
      header={
        <DashboardPageHeader 
          title="Workspaces" 
          description="Manage your client sub-accounts and workspaces."
          hideBreadcrumbs={true}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search workspaces..." className="pl-9" />
              </div>
              <Select defaultValue="active">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="all">All Status</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4 text-slate-500" />
              </Button>
              <Button className="gap-2 ml-2">
                <Plus className="h-4 w-4" />
                Create Workspace
              </Button>
            </div>
          }
        />
      }
    >
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Workspaces List */}
        <div className="space-y-4">
          {WORKSPACES.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function WorkspaceCard({ workspace }: { workspace: any }) {
  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Identity & Contact */}
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 rounded-lg border border-slate-200">
                <AvatarImage src={workspace.avatar} />
                <AvatarFallback className="rounded-lg">{workspace.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{workspace.name}</h3>
                  <Badge variant={workspace.status === 'Active' ? 'default' : 'secondary'} className="h-5 px-1.5 text-[10px]">
                    {workspace.status}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{workspace.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{workspace.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Metrics Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8">
            <MetricItem label="Active Users" value={workspace.metrics.activeUsers.value} change={workspace.metrics.activeUsers.change} icon={Users} />
            <MetricItem label="Calls" value={workspace.metrics.calls.value} change={workspace.metrics.calls.change} icon={Phone} />
            <MetricItem label="Emails" value={workspace.metrics.emails.value} change={workspace.metrics.emails.change} icon={Mail} />
            <MetricItem label="SMS" value={workspace.metrics.texts.value} change={workspace.metrics.texts.change} icon={MessageSquare} />
            <MetricItem label="Contacts" value={workspace.metrics.contacts.value} change={workspace.metrics.contacts.change} icon={Users} />
            <MetricItem label="Appointments" value={workspace.metrics.appointments.value} change={workspace.metrics.appointments.change} icon={Calendar} />
            <MetricItem label="Reviews" value={workspace.metrics.reviews.value} subtext={`(${workspace.metrics.reviews.count})`} icon={Star} />
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <div className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Feature Icons */}
          <div className="flex items-center gap-1.5 mr-4">
            {workspace.features.map((feature: string) => (
              <div key={feature} className="h-7 w-7 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500" title={feature}>
                {getFeatureIcon(feature)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
            <Wallet className="h-4 w-4" />
            {workspace.revenue}
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            <BarChart2 className="h-3.5 w-3.5" />
            Reports
          </Button>
          <Button size="sm" className="gap-2 w-full sm:w-auto">
            <ExternalLink className="h-3.5 w-3.5" />
            Switch to Workspace
          </Button>
        </div>
      </div>
    </Card>
  );
}

function MetricItem({ label, value, change, subtext, icon: Icon }: any) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        {/* <Icon className="h-3 w-3" /> */}
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</span>
        {change && (
          <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-emerald-600' : change === '0%' ? 'text-slate-400' : 'text-rose-600'}`}>
            {change}
          </span>
        )}
        {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
      </div>
    </div>
  );
}

function getFeatureIcon(feature: string) {
  switch (feature) {
    case 'sms': return <MessageSquare className="h-3.5 w-3.5" />;
    case 'email': return <Mail className="h-3.5 w-3.5" />;
    case 'calls': return <Phone className="h-3.5 w-3.5" />;
    case 'reviews': return <Star className="h-3.5 w-3.5" />;
    case 'payments': return <Wallet className="h-3.5 w-3.5" />;
    case 'ads': return <BarChart2 className="h-3.5 w-3.5" />;
    default: return <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />;
  }
}
