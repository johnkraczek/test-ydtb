import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Layout, 
  List, 
  Filter, 
  Columns, 
  Copy, 
  Star, 
  Download, 
  Share, 
  Pin, 
  EyeOff,
  ChevronRight,
  Save
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ViewSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenFields: () => void;
  onOpenFilter: () => void;
}

export function ViewSettings({ open, onOpenChange, onOpenFields, onOpenFilter }: ViewSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[360px] sm:w-[360px] p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="text-base font-medium">Customize view</SheetTitle>
        </SheetHeader>
        
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 shadow-sm">
            <List className="h-4 w-4 text-slate-500" />
            <Input 
              defaultValue="List" 
              className="border-none shadow-none h-7 p-0 focus-visible:ring-0 text-sm font-medium" 
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Show empty statuses</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Wrap text</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Show task locations</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Show subtask parent names</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Show closed tasks</span>
              <Switch />
            </div>
            
            <Button variant="ghost" size="sm" className="w-full justify-between px-0 hover:bg-transparent text-slate-500 font-normal h-auto py-1">
              <span>More options</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-between px-2 font-normal text-slate-700 dark:text-slate-300"
              onClick={() => {
                onOpenChange(false);
                onOpenFields();
              }}
            >
              <div className="flex items-center gap-2">
                <Columns className="h-4 w-4 text-slate-500" />
                <span>Fields</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <span>3 shown</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between px-2 font-normal text-slate-700 dark:text-slate-300"
              onClick={() => {
                onOpenChange(false);
                onOpenFilter();
              }}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span>Filter</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <span>None</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Button>
            
            <Button variant="ghost" className="w-full justify-between px-2 font-normal text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-slate-500" />
                <span>Group</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <span>Status</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Autosave for me</span>
              </div>
              <Switch />
            </div>
            
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Pin view</span>
              </div>
              <Switch />
            </div>
            
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Private view</span>
              </div>
              <Switch />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-1">
             <Button variant="ghost" className="w-full justify-start gap-2 px-2 font-normal text-slate-700 dark:text-slate-300">
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Copy link to view</span>
             </Button>
             
             <Button variant="ghost" className="w-full justify-between px-2 font-normal text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-500" />
                <span>Favorite</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between px-2 font-normal text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-slate-500" />
                <span>Export view</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-start gap-2 px-2 font-normal text-slate-700 dark:text-slate-300">
                <Share className="h-4 w-4 text-slate-500" />
                <span>Sharing & Permissions</span>
             </Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
