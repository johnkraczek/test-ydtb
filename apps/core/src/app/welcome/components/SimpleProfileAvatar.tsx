"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ydtb/ui/base/avatar";
import { Button } from "@ydtb/ui/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ydtb/ui/base/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SimpleProfileAvatar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const user = session?.user;
  const initials = getInitials(user?.name, user?.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-indigo-100 transition-all" variant="ghost">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage alt={user?.name || "User"} src={user?.image || ""} />
            <AvatarFallback className="bg-indigo-50 text-indigo-600">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2" forceMount>
        <div className="flex items-center justify-start gap-2 p-2 bg-slate-50 rounded-md mb-1">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={user?.name || "User"} src={user?.image || ""} />
            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-semibold text-sm">
              {user?.name || "User"}
            </p>
            <p className="w-[180px] truncate text-muted-foreground text-xs">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer rounded-md text-rose-600 focus:text-rose-700 focus:bg-rose-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}