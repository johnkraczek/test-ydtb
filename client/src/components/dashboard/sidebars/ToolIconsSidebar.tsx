
import { useState } from "react";
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
  MessageSquare,
  Image,
  GripHorizontal,
  MoreHorizontal,
  Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomizeNavigationDialog, ToolItem } from "../customization/CustomizeNavigationDialog";

const INITIAL_TOOLS: ToolItem[] = [
  {
    id: "home",
    icon: Home,
    label: "Dashboard",
    visible: true,
  },
  {
    id: "users",
    icon: Users,
    label: "Contacts",
    visible: true,
  },
  {
    id: "media",
    icon: Image,
    label: "Media Storage",
    visible: true,
  },
  {
    id: "automation",
    icon: Zap,
    label: "Automation",
    visible: true,
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    visible: true,
  },
  {
    id: "layers",
    icon: Layers,
    label: "Integrations",
    visible: false,
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    visible: false,
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
  const [tools, setTools] = useState<ToolItem[]>(INITIAL_TOOLS);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Filter visible tools for display
  const visibleTools = tools.filter(tool => tool.visible);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full py-2 pl-2">
        <div className="flex w-12 flex-col items-center gap-2 border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-md shadow-sm py-1.5 z-20">
          {/* Expand/Collapse Button */}
          {!isToolSidebarOpen && onToggleSidebar && (
            <div className="mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8 p-0 rounded-sm hover:bg-primary/10 text-slate-500 hover:text-primary transition-all"
                    onClick={onToggleSidebar}
                    variant="ghost"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 text-white border-0">
                  <p>Expand Sidebar</p>
                </TooltipContent>
              </Tooltip>
              <div className="w-6 h-px bg-slate-200 mx-auto mt-2" />
            </div>
          )}

          {/* Dynamic Tools */}
          {visibleTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTool;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-9 w-9 p-0 rounded-sm transition-all duration-300 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => onToolSelect?.(tool.id)}
                    variant="ghost"
                  >
                    <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
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
          
          <div className="w-6 h-px bg-slate-200 mx-auto mb-2" />

          {/* More/Customize Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`h-9 w-9 p-0 rounded-sm transition-all duration-300 ${
                  isCustomizeOpen
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                onClick={() => setIsCustomizeOpen(true)}
                variant="ghost"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-900 text-white border-0 font-medium ml-2">
              <p>More</p>
            </TooltipContent>
          </Tooltip>

          <CustomizeNavigationDialog 
            open={isCustomizeOpen} 
            onOpenChange={setIsCustomizeOpen}
            tools={tools}
            onToolsChange={setTools}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
