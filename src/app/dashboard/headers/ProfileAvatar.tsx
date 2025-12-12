"use client";

import { User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ProfileAvatar() {
  return (
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
  );
}