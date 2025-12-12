import {
  ChevronsLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";



interface ToolSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  toolId: string;
  onCreateClick?: () => void;
}

export function ToolSidebar({ isOpen, onToggle, toolId }: ToolSidebarProps) {
  const renderToolContent = () => {
    return (
      <div className="py-4 text-center text-sm text-slate-500">
        Select a tool to view options for {toolId}
      </div>
    );
  };

  return (
    <div
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-full rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 overflow-hidden border-0 ml-0 p-0"
        }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 min-h-[60px]">
          {isOpen && <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 tracking-tight pl-1">Tool Title HERE</h3>}
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

      </div>
    </div>
  );
}
