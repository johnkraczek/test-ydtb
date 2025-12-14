"use client";

import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, Plus, Search, Zap, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useWorkspace } from "~/context/workspace/workspace-context";

export function WorkspaceDropdown() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    activeWorkspace,
    workspaces,
    isLoading,
    switchWorkspace
  } = useWorkspace();

  if (isLoading) {
    return (
      <div className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-md transition-all shadow-sm hover:shadow-md h-10 overflow-hidden pr-2">
        <div className="flex items-center justify-center px-3">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Button
        variant="outline"
        className="h-10"
        onClick={() => {
          // Open create workspace dialog or navigate
          window.location.href = "/workspaces/new";
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Workspace
      </Button>
    );
  }

  const activeWorkspaceData = workspaces.find(ws => ws.id === activeWorkspace?.id) || workspaces[0];
  const initials = activeWorkspaceData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'WS';

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-md transition-all shadow-sm hover:shadow-md h-10 overflow-hidden pr-2">
          <div className="flex h-full w-10 items-center justify-center bg-primary font-bold text-sm text-primary-foreground transition-all">
            {initials}
          </div>
          <div className="flex flex-col text-left ml-2 mr-2 justify-center">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-none group-hover:text-primary transition-colors">
              {activeWorkspaceData?.name || "Select Workspace"}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-slate-500 text-[10px] leading-none">
                {activeWorkspaceData?.role || 'Member'}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px] p-0" sideOffset={8}>
        {/* Back to Agency View */}
        <div className="p-2 border-b border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 h-9 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agency View
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="w-full pl-8 h-9 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              placeholder="Find workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Workspaces List */}
        <div className="p-2 max-h-[240px] overflow-y-auto">
          <DropdownMenuLabel className="text-xs text-slate-500 font-medium px-2 py-1.5">
            Your Workspaces
          </DropdownMenuLabel>
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map((ws) => {
              const wsInitials = ws.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'WS';
              const isActive = ws.id === activeWorkspace?.id;

              return (
                <DropdownMenuItem
                  key={ws.id}
                  className="flex items-center gap-3 p-2 cursor-pointer rounded-md"
                  onClick={() => switchWorkspace(ws.id)}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-xs text-white ${isActive ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-slate-600'}`}>
                    {wsInitials}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`font-medium text-sm ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {ws.name}
                    </span>
                    <span className="text-xs text-slate-400">{ws.role}</span>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No workspaces found
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Create Workspace */}
        <div className="p-2">
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20"
            size="sm"
            onClick={() => {
              window.location.href = "/workspaces/new";
            }}
          >
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}