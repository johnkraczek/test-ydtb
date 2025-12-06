
import { Bell, Search, Settings, User, ArrowLeft, Plus, Check, ChevronDown, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function DashboardMainHeader() {
  const [workspaces] = useState([
    { id: "1", name: "Acme Corp", plan: "Free Plan", initials: "AC", active: true },
    { id: "2", name: "Stark Industries", plan: "Pro Plan", initials: "SI", active: false },
    { id: "3", name: "Wayne Enterprises", plan: "Enterprise", initials: "WE", active: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-2 sticky top-0 z-50">
      {/* Left section - Team Switcher */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 border border-slate-200/60 p-1.5 pr-3 rounded-md transition-all shadow-sm hover:shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-indigo-600 font-bold text-sm text-white shadow-sm shadow-indigo-200 group-hover:shadow-indigo-300 transition-all">
                AC
              </div>
              <div className="flex flex-col text-left mr-2">
                <span className="font-semibold text-sm text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">Acme Corp</span>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-slate-500 text-xs">Free Plan</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px] p-0" sideOffset={8}>
            {/* Back to Agency View */}
            <div className="p-2 border-b border-slate-100">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 h-9 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Agency View
              </Button>
            </div>

            {/* Search */}
            <div className="p-3 pb-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input 
                  className="w-full pl-8 h-9 text-sm bg-slate-50 border-slate-200" 
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
                filteredWorkspaces.map((ws) => (
                  <DropdownMenuItem key={ws.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-md">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-xs text-white ${ws.active ? 'bg-indigo-600 shadow-sm shadow-indigo-200' : 'bg-slate-600'}`}>
                      {ws.initials}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`font-medium text-sm ${ws.active ? 'text-slate-900' : 'text-slate-600'}`}>{ws.name}</span>
                      <span className="text-xs text-slate-400">{ws.plan}</span>
                    </div>
                    {ws.active && <Check className="h-4 w-4 text-indigo-600" />}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No workspaces found
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            {/* Create Workspace */}
            <div className="p-2">
              <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200" size="sm">
                <Plus className="h-4 w-4" />
                Create Workspace
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center section - Search */}
      <div className="mx-8 max-w-md flex-1">
        <div className="relative group">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            className="w-full pl-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all rounded-lg" 
            placeholder="Search resources..." 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section - Quick Actions and Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        
        <div className="h-8 w-px bg-slate-200 mx-1" />

        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </Button>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-indigo-100 transition-all ml-2" variant="ghost">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage alt="User" src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-indigo-50 text-indigo-600">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2" forceMount>
            <div className="flex items-center justify-start gap-2 p-2 bg-slate-50 rounded-md mb-1">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-sm">John Doe</p>
                <p className="w-[180px] truncate text-muted-foreground text-xs">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <Settings className="mr-2 h-4 w-4 text-slate-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md text-rose-600 focus:text-rose-700 focus:bg-rose-50">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
