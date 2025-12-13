
"use client";

import { Search, Hexagon } from "lucide-react";
import { useState } from "react";
import { WorkspaceDropdown } from "~/components/dashboard/headers/WorkspaceDropdown";
import { CommandPalette } from "~/components/dashboard/headers/CommandPalette";
import { NotificationDropdown } from "~/components/dashboard/headers/NotificationDropdown";
import { HelpDropdown } from "~/components/dashboard/headers/HelpDropdown";
import { ProfileAvatar } from "~/components/dashboard/headers/ProfileAvatar";

export function MainHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CommandPalette open={open} onOpenChange={setOpen} />

      <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-2 sticky top-0 z-50">
        {/* Left section - Team Switcher */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
              <Hexagon className="h-5 w-5 text-white fill-indigo-600" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden lg:block">AgencyOS</span>
          </div>

          <WorkspaceDropdown />
        </div>

        {/* Center section - Search */}
        <div className="mx-8 max-w-md flex-1">
          <div
            className="relative group cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <div className="w-full pl-10 h-10 flex items-center bg-slate-50 border border-slate-200 hover:border-indigo-300 text-sm text-slate-500 rounded-lg transition-all">
              Search resources...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right section - Quick Actions and Avatar */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-slate-200 mx-1" />

          <NotificationDropdown />
          <HelpDropdown />
          <ProfileAvatar />
        </div>
      </header>
    </>
  );
}
