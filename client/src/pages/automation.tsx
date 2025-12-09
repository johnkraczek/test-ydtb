
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Zap,
  Play,
  Pause,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  status: "active" | "inactive" | "draft";
  lastRun: string;
  totalRuns: number;
  successRate: number;
}

const AUTOMATIONS: Automation[] = [
  { 
    id: "1", 
    name: "New User Onboarding", 
    trigger: "User Created", 
    status: "active", 
    lastRun: "2 mins ago", 
    totalRuns: 1245,
    successRate: 99.8
  },
  { 
    id: "2", 
    name: "Order Processing", 
    trigger: "New Order", 
    status: "active", 
    lastRun: "15 mins ago", 
    totalRuns: 890,
    successRate: 98.5
  },
  { 
    id: "3", 
    name: "Lead Enrichment", 
    trigger: "Form Submission", 
    status: "inactive", 
    lastRun: "2 days ago", 
    totalRuns: 450,
    successRate: 95.0
  },
  { 
    id: "4", 
    name: "Support Routing", 
    trigger: "New Ticket", 
    status: "draft", 
    lastRun: "Never", 
    totalRuns: 0,
    successRate: 0
  },
  { 
    id: "5", 
    name: "Daily Summary Report", 
    trigger: "Schedule (Daily)", 
    status: "active", 
    lastRun: "5 hours ago", 
    totalRuns: 120,
    successRate: 100
  },
];

export default function AutomationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const filteredAutomations = AUTOMATIONS.filter(auto => 
    auto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input 
          placeholder="Search workflows..." 
          className="pl-8 h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs border-slate-200 dark:border-slate-800">
        <Filter className="h-3.5 w-3.5 text-slate-500" />
        Filter
      </Button>

      <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={() => setLocation('/automation/new/edit')}>
        <Plus className="h-3.5 w-3.5" />
        New Workflow
      </Button>
    </div>
  );

  return (
    <DashboardLayout 
      activeTool="automation"
      header={
        <DashboardPageHeader
          title="Automation"
          description="Manage your automated workflows and triggers."
          actions={headerActions}
        />
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <TableHead className="w-[300px]">Workflow Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="text-right">Total Runs</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAutomations.map((auto) => (
                <TableRow 
                  key={auto.id} 
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => setLocation(`/automation/${auto.id}/edit`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        auto.status === 'active' 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : auto.status === 'draft'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-orange-50 text-orange-600'
                      }`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{auto.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 font-normal text-slate-600">
                      {auto.trigger}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {auto.status === "active" && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1">
                        <Play className="h-3 w-3 fill-current" /> Active
                      </Badge>
                    )}
                    {auto.status === "inactive" && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 gap-1">
                        <Pause className="h-3 w-3 fill-current" /> Inactive
                      </Badge>
                    )}
                    {auto.status === "draft" && (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 gap-1">
                        <Clock className="h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-500">
                      {auto.lastRun}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-slate-600">{auto.totalRuns.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {auto.totalRuns > 0 && (
                        <div className="flex items-center justify-end gap-1.5">
                            <span className={`font-medium ${auto.successRate >= 98 ? 'text-emerald-600' : auto.successRate >= 90 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                {auto.successRate}%
                            </span>
                            {auto.successRate >= 98 ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                            )}
                        </div>
                    )}
                    {auto.totalRuns === 0 && <span className="text-slate-400">-</span>}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocation(`/automation/${auto.id}/edit`)}>
                          <Zap className="mr-2 h-4 w-4" /> Open Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" /> Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
