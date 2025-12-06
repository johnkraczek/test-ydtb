"use client";

import {
	BarChart3,
	ChevronsRight,
	Database,
	FileText,
	Home,
	Settings,
	Users,
	Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Separator } from "~/components/ui/separator";

const mainTools = [
	{
		id: "home",
		icon: Home,
		label: "Dashboard",
		active: true,
	},
	{
		id: "documents",
		icon: FileText,
		label: "Documents",
		active: false,
	},
	{
		id: "analytics",
		icon: BarChart3,
		label: "Analytics",
		active: false,
	},
	{
		id: "database",
		icon: Database,
		label: "Database",
		active: false,
	},
	{
		id: "users",
		icon: Users,
		label: "Users",
		active: false,
	},
	{
		id: "automation",
		icon: Zap,
		label: "Automation",
		active: false,
	},
];

const bottomTools = [
	{
		id: "settings",
		icon: Settings,
		label: "Settings",
		active: false,
	},
];

interface ToolIconsSidebarProps {
	activeTool?: string;
	onToolSelect?: (toolId: string) => void;
	isToolSidebarOpen?: boolean;
	onToggleSidebar?: () => void;
}

export function ToolIconsSidebar({
	activeTool = "home",
	onToolSelect,
	isToolSidebarOpen = true,
	onToggleSidebar,
}: ToolIconsSidebarProps) {
	return (
		<TooltipProvider>
			<div className="flex h-full pb-2">
				<div className="flex w-12 flex-col items-center gap-2 border-r bg-gradient-to-b from-blue-600 to-blue-900 backdrop-blur-sm rounded-lg mr-2 shadow-lg p-2">
					{/* Expand/Collapse Button - Only show when sidebar is collapsed */}
					{!isToolSidebarOpen && onToggleSidebar && (
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-8 w-8 p-0 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
									onClick={onToggleSidebar}
									variant="ghost"
								>
									<ChevronsRight className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>Expand Sidebar</p>
							</TooltipContent>
						</Tooltip>
					</>
				)}

				{/* Main Tools */}
				{mainTools.map((tool) => {
					const Icon = tool.icon;
					const isActive = tool.id === activeTool;

					return (
						<Tooltip key={tool.id}>
							<TooltipTrigger asChild>
								<Button
									className={`h-8 w-8 p-0 rounded-lg ${isActive ? "bg-primary" : ""}`}
									onClick={() => onToolSelect?.(tool.id)}
									size="lg"
									variant={isActive ? "default" : "ghost"}
								>
									<Icon className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{tool.label}</p>
							</TooltipContent>
						</Tooltip>
					);
				})}

				{/* Spacer to push bottom tools to the bottom */}
				<div className="flex-1" />

				{/* Bottom Tools */}
				{bottomTools.map((tool) => {
					const Icon = tool.icon;
					const isActive = tool.id === activeTool;

					return (
						<Tooltip key={tool.id}>
							<TooltipTrigger asChild>
								<Button
									className={`h-8 w-8 p-0 rounded-lg ${isActive ? "bg-primary" : ""}`}
									onClick={() => onToolSelect?.(tool.id)}
									size="lg"
									variant={isActive ? "default" : "ghost"}
								>
									<Icon className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{tool.label}</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
				</div>
			</div>
		</TooltipProvider>
	);
}
