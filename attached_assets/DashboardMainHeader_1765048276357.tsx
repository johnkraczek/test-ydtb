"use client";

import { Bell, Plus, Search, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

export function DashboardMainHeader() {
	return (
		<header className="flex h-16 items-center justify-between border-b bg-background px-4">
			{/* Left section - Team Switcher */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-semibold text-sm text-white">
						AC
					</div>
					<div className="flex flex-col">
						<span className="font-medium text-sm">Acme Corp</span>
						<span className="text-muted-foreground text-xs">Free Plan</span>
					</div>
				</div>
			</div>

			{/* Center section - Search */}
			<div className="mx-8 max-w-md flex-1">
				<div className="relative">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
					<Input className="w-full pl-10" placeholder="Search..." />
				</div>
			</div>

			{/* Right section - Quick Actions and Avatar */}
			<div className="flex items-center gap-3">
				{/* Quick Actions */}
				<Button className="gap-2" size="sm" variant="ghost">
					<Plus className="h-4 w-4" />
					Quick Action
				</Button>
				<Button size="sm" variant="ghost">
					<Settings className="h-4 w-4" />
				</Button>
				<Button size="sm" variant="ghost">
					<Bell className="h-4 w-4" />
				</Button>

				{/* Avatar Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="relative h-8 w-8 rounded-full" variant="ghost">
							<Avatar className="h-8 w-8">
								<AvatarImage alt="User" src="/avatars/shadcn.jpg" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56" forceMount>
						<div className="flex items-center justify-start gap-2 p-2">
							<div className="flex flex-col space-y-1 leading-none">
								<p className="font-medium">John Doe</p>
								<p className="w-[200px] truncate text-muted-foreground text-sm">
									john.doe@example.com
								</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
