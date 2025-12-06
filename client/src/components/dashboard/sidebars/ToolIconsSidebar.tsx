
import {
  BarChart3,
  ChevronsRight,
  Database,
  FileText,
  Home,
  Settings,
  Users,
  Zap,
  Layers,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainTools = [
  {
    id: "home",
    icon: Home,
    label: "Dashboard",
    active: true,
  },
  {
    id: "documents",
    icon: FileText,
    label: "Documents",
    active: false,
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    active: false,
  },
  {
    id: "database",
    icon: Database,
    label: "Database",
    active: false,
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    active: false,
  },
  {
    id: "automation",
    icon: Zap,
    label: "Automation",
    active: false,
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    active: false,
  },
];

const bottomTools = [
  {
    id: "layers",
    icon: Layers,
    label: "Integrations",
    active: false,
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    active: false,
  },
];

interface ToolIconsSidebarProps {
  activeTool?: string;
  onToolSelect?: (toolId: string) => void;
  isToolSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function ToolIconsSidebar({
  activeTool = "home",
  onToolSelect,
  isToolSidebarOpen = true,
  onToggleSidebar,
}: ToolIconsSidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full py-2 pl-2">
        <div className="flex w-16 flex-col items-center gap-3 border border-slate-200/60 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm py-4 z-20">
          {/* Expand/Collapse Button */}
          {!isToolSidebarOpen && onToggleSidebar && (
            <div className="mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-10 w-10 p-0 rounded-xl hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-all"
                    onClick={onToggleSidebar}
                    variant="ghost"
                  >
                    <ChevronsRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 text-white border-0">
                  <p>Expand Sidebar</p>
                </TooltipContent>
              </Tooltip>
              <div className="w-8 h-px bg-slate-200 mx-auto mt-2" />
            </div>
          )}

          {/* Main Tools */}
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTool;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    onClick={() => onToolSelect?.(tool.id)}
                    variant="ghost"
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 text-white border-0 font-medium ml-2">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />
          
          <div className="w-8 h-px bg-slate-200 mx-auto mb-2" />

          {/* Bottom Tools */}
          {bottomTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTool;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-10 w-10 p-0 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    onClick={() => onToolSelect?.(tool.id)}
                    variant="ghost"
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 text-white border-0 font-medium ml-2">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
