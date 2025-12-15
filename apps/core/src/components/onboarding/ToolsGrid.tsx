import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVAILABLE_TOOLS } from "./constants";
import { Tool } from "./types";

interface ToolsGridProps {
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
}

export function ToolsGrid({ selectedTools, onToolsChange }: ToolsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTool = (id: string) => {
    if (AVAILABLE_TOOLS.find(t => t.id === id)?.disabled) return;

    const tools = selectedTools.includes(id)
      ? selectedTools.filter(t => t !== id)
      : [...selectedTools, id];
    onToolsChange(tools);
  };

  const addAll = () => {
    // If searching, only add visible tools
    if (searchQuery) {
      const visibleIds = filteredTools.filter(t => !t.disabled).map(t => t.id);
      const newTools = [...new Set([...selectedTools, ...visibleIds])];
      onToolsChange(newTools);
    } else {
      onToolsChange(AVAILABLE_TOOLS.filter(t => !t.disabled).map(t => t.id));
    }
  };

  const filteredTools: Tool[] = AVAILABLE_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Configure Workspace Tools</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{selectedTools.length} enabled</span>
            <Button variant="outline" size="sm" onClick={addAll}>
              {searchQuery ? "Add Visible" : "Add All"}
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const isSelected = selectedTools.includes(tool.id);
              const Icon = tool.icon;

              return (
                <div
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    tool.disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" :
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={cn("font-medium", isSelected ? "text-indigo-900" : "text-slate-900")}>
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {tool.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <Check className="h-5 w-5 text-indigo-600" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-500">
              <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <p>No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}