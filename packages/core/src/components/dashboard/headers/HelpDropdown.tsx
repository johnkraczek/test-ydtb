"use client";

import { HelpCircle, FileText, MessageSquare, LayoutGrid, Mail } from "lucide-react";
import { Button } from "@ydtb/ui/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ydtb/ui/base/dropdown-menu";

export function HelpDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative focus-visible:ring-0 focus-visible:ring-offset-0">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1" sideOffset={8}>
        <DropdownMenuItem className="cursor-pointer rounded-md p-2">
          <FileText className="mr-2 h-4 w-4 text-slate-500" />
          <span>Documentation</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-md p-2">
          <MessageSquare className="mr-2 h-4 w-4 text-slate-500" />
          <span>Community Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-md p-2">
          <LayoutGrid className="mr-2 h-4 w-4 text-slate-500" />
          <span>Help Center</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-md p-2">
          <Mail className="mr-2 h-4 w-4 text-slate-500" />
          <span>Contact Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}