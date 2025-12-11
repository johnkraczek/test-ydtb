
import { useState } from "react";
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
  Wallet,
  Check,
  CheckCheck,
  Trash,
  Archive,
  Ban,
  X,
  FolderPlus
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterBuilder, Filter as FilterType } from "@/components/dashboard/FilterBuilder";

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
  const [visibleMetrics, setVisibleMetrics] = useState({
    activeUsers: true,
    calls: true,
    emails: true,
    sms: true,
    contacts: true,
    appointments: true,
    reviews: true,
  });

  const [selectedWorkspaces, setSelectedWorkspaces] = useState<number[]>([]);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter state
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterColumns = [
    { id: "name", label: "Name", type: "text" },
    { id: "status", label: "Status", type: "text" },
    { id: "revenue", label: "Revenue", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "phone", label: "Phone", type: "text" },
  ];

  const checkFilter = (item: any, filter: FilterType) => {
    let value = item[filter.field];
    
    if (typeof value === 'number') {
        value = value.toString();
    } else if (value === undefined || value === null) {
        value = '';
    } else {
        value = String(value).toLowerCase();
    }
    
    const filterValue = String(filter.value).toLowerCase();
    
    switch (filter.operator) {
      case 'contains':
        return value.includes(filterValue);
      case 'does_not_contain':
        return !value.includes(filterValue);
      case 'is':
        return value === filterValue;
      case 'is_not':
        return value !== filterValue;
      case 'starts_with':
        return value.startsWith(filterValue);
      case 'ends_with':
        return value.endsWith(filterValue);
      case 'is_empty':
        return !value || value.length === 0;
      case 'is_not_empty':
        return value && value.length > 0;
      default:
        return true;
    }
  };

  const filteredWorkspaces = WORKSPACES.filter(workspace => {
    // Search query filter
    const matchesSearch = 
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    // Advanced filters
    if (filters.length === 0) return true;
    
    const evaluateFilters = (filterList: FilterType[], item: any): boolean => {
        if (filterList.length === 0) return true;
        
        let result = true;
        
        // Process first item
        const first = filterList[0];
        if (first.type === 'group') {
             result = evaluateFilters(first.items, item);
        } else {
             result = checkFilter(item, first);
        }
        
        // Process remaining items
        for (let i = 1; i < filterList.length; i++) {
            const filter = filterList[i];
            let matches = false;
            
            if (filter.type === 'group') {
                matches = evaluateFilters(filter.items, item);
            } else {
                matches = checkFilter(item, filter);
            }
            
            if (filter.logic === 'AND') {
                result = result && matches;
            } else {
                result = result || matches;
            }
        }
        
        return result;
    };
    
    return evaluateFilters(filters, workspace);
  });

  const toggleMetric = (key: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleWorkspaceSelection = (id: number) => {
    setSelectedWorkspaces(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedWorkspaces.length === filteredWorkspaces.length) {
      setSelectedWorkspaces([]);
    } else {
      setSelectedWorkspaces(filteredWorkspaces.map(w => w.id));
    }
  };

  const handleCreateGroup = () => {
    // In a real app, this would create the group
    console.log("Creating group:", newGroupName);
    setIsAddGroupOpen(false);
    setNewGroupName("");
  };

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
                <Input 
                  placeholder="Search workspaces..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={selectedWorkspaces.length === filteredWorkspaces.length && filteredWorkspaces.length > 0 ? "secondary" : "outline"} 
                      size="icon" 
                      onClick={toggleSelectAll}
                      className={selectedWorkspaces.length === filteredWorkspaces.length && filteredWorkspaces.length > 0 ? "bg-slate-100 dark:bg-slate-800" : ""}
                    >
                      <CheckCheck className="h-4 w-4 text-slate-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select All Workspaces</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <FilterBuilder 
                columns={filterColumns} 
                filters={filters} 
                onFiltersChange={setFilters}
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm px-2 py-1.5 text-slate-900 dark:text-slate-100">Show Metrics</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-activeUsers" 
                          checked={visibleMetrics.activeUsers}
                          onCheckedChange={() => toggleMetric('activeUsers')}
                        />
                        <Label htmlFor="metric-activeUsers" className="flex-1 cursor-pointer">Active Users</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-calls" 
                          checked={visibleMetrics.calls}
                          onCheckedChange={() => toggleMetric('calls')}
                        />
                        <Label htmlFor="metric-calls" className="flex-1 cursor-pointer">Calls</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-emails" 
                          checked={visibleMetrics.emails}
                          onCheckedChange={() => toggleMetric('emails')}
                        />
                        <Label htmlFor="metric-emails" className="flex-1 cursor-pointer">Emails</Label>
                      </div>
                       <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-sms" 
                          checked={visibleMetrics.sms}
                          onCheckedChange={() => toggleMetric('sms')}
                        />
                        <Label htmlFor="metric-sms" className="flex-1 cursor-pointer">SMS</Label>
                      </div>
                       <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-contacts" 
                          checked={visibleMetrics.contacts}
                          onCheckedChange={() => toggleMetric('contacts')}
                        />
                        <Label htmlFor="metric-contacts" className="flex-1 cursor-pointer">Contacts</Label>
                      </div>
                       <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-appointments" 
                          checked={visibleMetrics.appointments}
                          onCheckedChange={() => toggleMetric('appointments')}
                        />
                        <Label htmlFor="metric-appointments" className="flex-1 cursor-pointer">Appointments</Label>
                      </div>
                       <div className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                        <Checkbox 
                          id="metric-reviews" 
                          checked={visibleMetrics.reviews}
                          onCheckedChange={() => toggleMetric('reviews')}
                        />
                        <Label htmlFor="metric-reviews" className="flex-1 cursor-pointer">Reviews</Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button className="gap-2 ml-2">
                <Plus className="h-4 w-4" />
                Create Workspace
              </Button>
            </div>
          }
        />
      }
    >
      <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
        {/* Workspaces List */}
        <div className="space-y-4">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard 
              key={workspace.id} 
              workspace={workspace} 
              visibleMetrics={visibleMetrics}
              isSelected={selectedWorkspaces.includes(workspace.id)}
              onToggleSelection={() => toggleWorkspaceSelection(workspace.id)}
            />
          ))}
          {filteredWorkspaces.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No workspaces found matching your filters.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setFilters([]);
                  setSearchQuery("");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedWorkspaces.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4"
          >
            <div className="bg-[#1a1a1a] text-white rounded-lg shadow-2xl border border-gray-800 p-1.5 flex items-center gap-1">
              {/* Selection Count & Clear */}
              <div className="flex items-center gap-2 px-2 pl-3">
                <span className="font-medium text-sm whitespace-nowrap">{selectedWorkspaces.length} Selected</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-gray-400 hover:text-white hover:bg-white/20 rounded-full" 
                  onClick={() => setSelectedWorkspaces([])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="h-5 w-px bg-gray-700 mx-1" />

              {/* Actions */}
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 h-8 px-3 rounded-md font-medium">
                 <Archive className="h-4 w-4 mr-2" />
                 Deactivate
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-white/10 h-8 px-3 rounded-md font-medium" 
                onClick={() => setIsAddGroupOpen(true)}
              >
                 <FolderPlus className="h-4 w-4 mr-2" />
                 Add Group
              </Button>

              <div className="h-5 w-px bg-gray-700 mx-1" />

              {/* Delete */}
              <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/30 h-8 w-8 rounded-md">
                <Trash className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 h-8 px-3 rounded-md font-medium">
                 <MoreHorizontal className="h-4 w-4 mr-2" />
                 More
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your workspaces.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input 
                id="name" 
                value={newGroupName} 
                onChange={(e) => setNewGroupName(e.target.value)} 
                placeholder="e.g. Enterprise Clients"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup} disabled={!newGroupName}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function WorkspaceCard({ workspace, visibleMetrics, isSelected, onToggleSelection }: { workspace: any, visibleMetrics: any, isSelected: boolean, onToggleSelection: () => void }) {
  // Count active metrics to adjust grid columns if needed
  const activeMetricCount = Object.values(visibleMetrics).filter(Boolean).length;
  
  return (
    <Card className={`overflow-hidden border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Identity & Contact */}
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative group cursor-pointer" onClick={onToggleSelection}>
                 <Avatar className="h-12 w-12 rounded-lg border border-slate-200 group-hover:opacity-80 transition-opacity">
                   <AvatarImage src={workspace.avatar} />
                   <AvatarFallback className="rounded-lg">{workspace.name.substring(0, 2)}</AvatarFallback>
                 </Avatar>
                 {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded-lg">
                        <Check className="h-6 w-6 text-white" />
                    </div>
                 )}
              </div>
              
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
          <div className={`flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 ${activeMetricCount === 0 ? 'hidden lg:hidden' : ''}`}>
            {visibleMetrics.activeUsers && (
              <MetricItem label="Active Users" value={workspace.metrics.activeUsers.value} change={workspace.metrics.activeUsers.change} icon={Users} />
            )}
            {visibleMetrics.calls && (
              <MetricItem label="Calls" value={workspace.metrics.calls.value} change={workspace.metrics.calls.change} icon={Phone} />
            )}
            {visibleMetrics.emails && (
              <MetricItem label="Emails" value={workspace.metrics.emails.value} change={workspace.metrics.emails.change} icon={Mail} />
            )}
            {visibleMetrics.sms && (
              <MetricItem label="SMS" value={workspace.metrics.texts.value} change={workspace.metrics.texts.change} icon={MessageSquare} />
            )}
            {visibleMetrics.contacts && (
              <MetricItem label="Contacts" value={workspace.metrics.contacts.value} change={workspace.metrics.contacts.change} icon={Users} />
            )}
            {visibleMetrics.appointments && (
              <MetricItem label="Appointments" value={workspace.metrics.appointments.value} change={workspace.metrics.appointments.change} icon={Calendar} />
            )}
            {visibleMetrics.reviews && (
              <MetricItem label="Reviews" value={workspace.metrics.reviews.value} subtext={`(${workspace.metrics.reviews.count})`} icon={Star} />
            )}
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
