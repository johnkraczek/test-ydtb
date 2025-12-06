
import {
  ChevronsLeft,
  ChevronRight,
  Clock,
  Database,
  Folder,
  Settings,
  Star,
  User,
  ArrowUpRight,
  Plus,
  LayoutGrid,
  PieChart,
  CreditCard,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ToolSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  toolId: string;
}

export function ToolSidebar({ isOpen, onToggle, toolId }: ToolSidebarProps) {
  const renderToolContent = () => {
    switch (toolId) {
      case "home":
        return <HomeSidebarContent />;
      case "documents":
        return <DocumentsSidebarContent />;
      case "analytics":
        return <AnalyticsSidebarContent />;
      case "settings":
        return <SettingsSidebarContent />;
      default:
        return <DefaultSidebarContent />;
    }
  };

  return (
    <div
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-full rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 overflow-hidden border-0 ml-0 p-0"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 min-h-[60px]">
          {isOpen && <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 tracking-tight pl-1">Explorer</h3>}
          <Button
            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ml-auto"
            onClick={onToggle}
            size="sm"
            variant="ghost"
          >
            {isOpen ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Tool-specific content */}
        <div className="flex-1 overflow-hidden">
           <ScrollArea className="h-full p-3">
             <div className="min-w-[200px]">
                {renderToolContent()}
             </div>
           </ScrollArea>
        </div>
        
        {/* Bottom Action */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shadow-none">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Create New</span>
            </Button>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="mb-2 px-2 font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</h4>
            <div className="space-y-0.5">
                {children}
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, badge, active }: { icon: any, label: string, badge?: string, active?: boolean }) {
    return (
        <Button 
            className={`w-full justify-between group h-9 rounded-lg px-2.5 font-normal ${active ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`} 
            variant="ghost"
        >
            <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span className="truncate">{label}</span>
            </div>
            {badge && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {badge}
                </Badge>
            )}
        </Button>
    )
}

function HomeSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Workspace">
          <SidebarItem icon={LayoutGrid} label="Overview" active />
          <SidebarItem icon={Clock} label="Recent Activity" badge="3" />
          <SidebarItem icon={Star} label="Favorites" />
      </SidebarSection>
      
      <SidebarSection title="Projects">
          <SidebarItem icon={Folder} label="Q4 Marketing" />
          <SidebarItem icon={Folder} label="Mobile App Redesign" />
          <SidebarItem icon={Folder} label="Internal Dashboard" />
          <Button className="w-full justify-start gap-2 h-8 px-2.5 text-slate-400 hover:text-primary mt-1" variant="ghost">
            <Plus className="h-3 w-3" />
            <span className="text-xs font-medium">Add Project</span>
          </Button>
      </SidebarSection>
    </div>
  );
}

function DocumentsSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Library">
        <SidebarItem icon={Folder} label="All Documents" active />
        <SidebarItem icon={User} label="Shared with Me" badge="12" />
        <SidebarItem icon={Clock} label="Recent" />
      </SidebarSection>
      
       <SidebarSection title="Folders">
        <SidebarItem icon={Folder} label="Contracts" />
        <SidebarItem icon={Folder} label="Invoices" />
        <SidebarItem icon={Folder} label="Specs" />
      </SidebarSection>
    </div>
  );
}

function AnalyticsSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Dashboards">
        <SidebarItem icon={PieChart} label="Overview" active />
        <SidebarItem icon={ArrowUpRight} label="Real-time" badge="Live" />
      </SidebarSection>
      
      <SidebarSection title="Reports">
        <SidebarItem icon={FileText} label="Weekly Summary" />
        <SidebarItem icon={FileText} label="Monthly Growth" />
        <SidebarItem icon={FileText} label="User Retention" />
      </SidebarSection>
    </div>
  );
}

function SettingsSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="App Settings">
        <SidebarItem icon={Settings} label="General" active />
        <SidebarItem icon={User} label="Account" />
        <SidebarItem icon={CreditCard} label="Billing" />
        <SidebarItem icon={Database} label="Data & Privacy" />
      </SidebarSection>
    </div>
  );
}

function DefaultSidebarContent() {
  return (
    <div className="flex h-40 items-center justify-center">
      <p className="text-slate-400 text-sm text-center px-4">Select a tool from the sidebar to view options</p>
    </div>
  );
}
