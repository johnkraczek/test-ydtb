"use client";

import { Bell, LayoutGrid, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@ydtb/ui/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ydtb/ui/base/dropdown-menu";
import { cn } from "@ydtb/core/lib/utils";

const notifications = [
  {
    id: 1,
    title: "New comment on Project Alpha",
    description: "Sarah left a comment on the dashboard design.",
    time: "2 min ago",
    read: false,
    type: "comment"
  },
  {
    id: 2,
    title: "System Update",
    description: "v2.4.0 has been successfully deployed.",
    time: "1 hour ago",
    read: false,
    type: "system"
  },
  {
    id: 3,
    title: "Task Completed",
    description: "Homepage redesign task marked as done.",
    time: "3 hours ago",
    read: true,
    type: "task"
  }
];

export function NotificationDropdown() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative focus-visible:ring-0 focus-visible:ring-offset-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-transparent font-medium">
            Mark all as read
          </Button>
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 rounded-none border-b border-slate-50 last:border-0">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                notification.type === 'comment' && "bg-blue-100 text-blue-600",
                notification.type === 'system' && "bg-purple-100 text-purple-600",
                notification.type === 'task' && "bg-green-100 text-green-600"
              )}>
                {notification.type === 'comment' && <MessageSquare className="h-4 w-4" />}
                {notification.type === 'system' && <LayoutGrid className="h-4 w-4" />}
                {notification.type === 'task' && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-medium leading-none", !notification.read && "text-slate-900", notification.read && "text-slate-600")}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-normal">
                  {notification.description}
                </p>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {notification.time}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600 hover:text-slate-900 h-8">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}