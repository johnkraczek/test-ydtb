import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, GripVertical, Check, Moon, Sun, Monitor } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "next-themes";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useThemePattern } from "@/hooks/use-theme-pattern";
import { cn } from "@/lib/utils";

export interface ToolItem {
  id: string;
  icon: any;
  label: string;
  visible: boolean;
}

interface CustomizeNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tools: ToolItem[];
  onToolsChange: (tools: ToolItem[]) => void;
}

// Sortable Item Component
function SortableToolItem({ tool, onToggle }: { tool: ToolItem; onToggle: (id: string, checked: boolean) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = tool.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md group"
    >
      <div className="flex items-center justify-center text-slate-400 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox 
        id={`tool-${tool.id}`} 
        checked={tool.visible}
        onCheckedChange={(checked) => onToggle(tool.id, checked as boolean)}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      <div className="flex items-center gap-2 flex-1">
        <div className="h-6 w-6 flex items-center justify-center text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
        <Label htmlFor={`tool-${tool.id}`} className="font-medium text-sm text-slate-700 dark:text-slate-300 cursor-pointer flex-1">
          {tool.label}
        </Label>
      </div>
    </div>
  );
}

const availableThemeColors = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-950" },
  { name: "Slate", value: "slate", color: "bg-slate-500" },
  { name: "Stone", value: "stone", color: "bg-stone-500" },
  { name: "Gray", value: "gray", color: "bg-gray-500" },
  { name: "Neutral", value: "neutral", color: "bg-neutral-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Rose", value: "rose", color: "bg-rose-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
  { name: "Violet", value: "violet", color: "bg-violet-500" },
] as const;

const availableThemePatterns = [
  { name: "None", value: "none", preview: "bg-white dark:bg-slate-900" },
  { name: "Dots", value: "dots", preview: "bg-dot-pattern" },
  { name: "Grid", value: "grid", preview: "bg-grid-pattern" },
  { name: "Graph", value: "graph", preview: "bg-graph-paper" },
  { name: "Noise", value: "noise", preview: "bg-noise" },
] as const;

export function CustomizeNavigationDialog({
  open,
  onOpenChange,
  tools,
  onToolsChange,
}: CustomizeNavigationDialogProps) {
  const { theme, setTheme } = useTheme();
  const { themeColor, setThemeColor } = useThemeColor();
  const { themePattern, setThemePattern } = useThemePattern();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tools.findIndex((t) => t.id === active.id);
      const newIndex = tools.findIndex((t) => t.id === over.id);
      onToolsChange(arrayMove(tools, oldIndex, newIndex));
    }
  };

  const handleToggleVisibility = (id: string, checked: boolean) => {
    const newTools = tools.map(t => 
      t.id === id ? { ...t, visible: checked } : t
    );
    onToolsChange(newTools);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl sm:rounded-xl">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customize</DialogTitle>
            <p className="text-xs text-slate-500 mt-0.5">Personalize and organize your interface</p>
          </div>
        </div>

        <Tabs defaultValue="navigation" className="w-full">
          <div className="px-4 pt-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <TabsList className="bg-transparent h-9 p-0 gap-4 w-full justify-start rounded-none">
              <TabsTrigger 
                value="navigation" 
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 text-xs font-medium text-slate-500"
              >
                Navigation
              </TabsTrigger>
              <TabsTrigger 
                value="general" 
                className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 text-xs font-medium text-slate-500"
              >
                General
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="navigation" className="p-0 m-0 h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={tools.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {tools.map((tool) => (
                      <SortableToolItem 
                        key={tool.id} 
                        tool={tool} 
                        onToggle={handleToggleVisibility}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          <TabsContent value="general" className="p-4 m-0 h-[400px]">
            <div className="text-center text-slate-400 mt-20">
              General settings coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
