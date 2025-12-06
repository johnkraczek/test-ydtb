
import { Bell, Plus, Search, Settings, User, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function DashboardMainHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-6 sticky top-0 z-50">
      {/* Left section - Team Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-sm text-white shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-all">
            AC
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800 leading-none">Acme Corp</span>
            <span className="text-slate-500 text-xs mt-1">Free Plan</span>
          </div>
        </div>
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
