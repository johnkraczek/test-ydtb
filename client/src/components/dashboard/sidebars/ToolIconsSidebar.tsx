
import { useState, useEffect } from "react";
import {
  ChevronsRight,
  Home,
  Settings,
  Users,
  Zap,
  Layers,
  MessageSquare,
  Image,
  Grid3X3,
  LayoutTemplate,
  File,
  Rocket,
  Briefcase,
  Building,
  CreditCard,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomizeNavigationDialog, ToolItem } from "../customization/CustomizeNavigationDialog";

const INITIAL_TOOLS: ToolItem[] = [
  {
    id: "launchpad",
    icon: Rocket,
    label: "Launchpad",
    visible: true,
  },
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
    id: "team",
    icon: Briefcase,
    label: "Team",
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
    id: "pages",
    icon: File,
    label: "Pages",
    visible: true,
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    visible: true,
  },
  {
    id: "sop",
    icon: FileText,
    label: "SOP Library",
    visible: true,
  },
  {
    id: "spaces",
    icon: Layers, // Placeholder icon
    label: "Spaces",
    visible: false,
  },
];

// Always fixed at the bottom
const CLIENT_BOTTOM_TOOLS = [
  {
    id: "integrations",
    icon: Layers,
    label: "Integrations",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  },
];

const AGENCY_BOTTOM_TOOLS = [
  {
    id: "agency-settings",
    icon: Settings,
    label: "Agency Settings",
  },
];

import { FileText } from "lucide-react"; // Import missing icon

interface ToolIconsSidebarProps {
  activeTool?: string;
  onToolSelect?: (toolId: string) => void;
  isToolSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  mode?: "client" | "agency";
}

const AGENCY_TOOLS: ToolItem[] = [
  {
    id: "agency-home",
    icon: Home,
    label: "Agency Dashboard",
    visible: true,
  },
];

export function ToolIconsSidebar({
  activeTool = "home",
  onToolSelect,
  isToolSidebarOpen = true,
  onToggleSidebar,
  mode = "client",
}: ToolIconsSidebarProps) {
  const [tools, setTools] = useState<ToolItem[]>(mode === "agency" ? AGENCY_TOOLS : INITIAL_TOOLS);
  const bottomTools = mode === "agency" ? AGENCY_BOTTOM_TOOLS : CLIENT_BOTTOM_TOOLS;
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Update tools when mode changes
  useEffect(() => {
    setTools(mode === "agency" ? AGENCY_TOOLS : INITIAL_TOOLS);
  }, [mode]);

  // If the active tool is hidden by the user, redirect to home (Dashboard)
  // This handles the case where a user hides "Launchpad" while currently on the Launchpad page
  useEffect(() => {
    const activeToolItem = tools.find(t => t.id === activeTool);
    if (activeToolItem && !activeToolItem.visible) {
      // Only redirect if we are not already on home
      if (activeTool !== "home") {
        onToolSelect?.("home");
      }
    }
  }, [tools, activeTool, onToolSelect]);

  // Filter visible and hidden tools
  // If a tool is active, it should be visible even if it's hidden in settings
  const visibleTools = tools.filter(tool => tool.visible || tool.id === activeTool);
  const hiddenTools = tools.filter(tool => !tool.visible && tool.id !== activeTool);

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

          {/* Dynamic Visible Tools */}
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

          {/* More Button (Popover) */}
          <Popover open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    className={`h-9 w-9 p-0 rounded-sm transition-all duration-300 ${
                      isMoreOpen
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    variant="ghost"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-900 text-white border-0 font-medium ml-2">
                <p>More</p>
              </TooltipContent>
            </Tooltip>
            
            <PopoverContent side="right" align="start" className="w-64 p-2 ml-2">
              <div className="grid grid-cols-3 gap-2 p-2">
                {hiddenTools.map((tool) => {
                   const Icon = tool.icon;
                   return (
                     <button
                       key={tool.id}
                       className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                       onClick={() => {
                         onToolSelect?.(tool.id);
                         setIsMoreOpen(false);
                       }}
                     >
                       <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-sm">
                         <Icon className="h-4 w-4" />
                       </div>
                       <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">
                         {tool.label}
                       </span>
                     </button>
                   );
                })}
              </div>
              
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 h-8 gap-2"
                  onClick={() => {
                    setIsMoreOpen(false);
                    setIsCustomizeOpen(true);
                  }}
                >
                  <Settings className="h-3 w-3" />
                  Customize navigation
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Spacer */}
          <div className="flex-1" />
          
          <div className="w-6 h-px bg-slate-200 mx-auto mb-2" />

          {/* Bottom Tools (Fixed) */}
          {bottomTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTool;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-9 w-9 p-0 rounded-sm transition-all duration-300 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
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
