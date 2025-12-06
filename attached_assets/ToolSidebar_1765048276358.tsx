"use client";

import {
	ChevronsLeft,
	ChevronRight,
	Clock,
	Database,
	Folder,
	Settings,
	Star,
	User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

interface ToolSidebarProps {
	isOpen: boolean;
	onToggle: () => void;
	toolId: string;
}

export function ToolSidebar({ isOpen, onToggle, toolId }: ToolSidebarProps) {
	const renderToolContent = () => {
		switch (toolId) {
			case "home":
				return <HomeSidebarContent />;
			case "documents":
				return <DocumentsSidebarContent />;
			case "analytics":
				return <AnalyticsSidebarContent />;
			case "settings":
				return <SettingsSidebarContent />;
			default:
				return <DefaultSidebarContent />;
		}
	};

	return (
		<div
			className={`bg-background transition-all duration-300 ease-in-out pb-2 ${
				isOpen ? "w-64 border-l border-t rounded-tl-lg" : "w-0 overflow-hidden"
			}`}
		>
			<div className="flex h-full flex-col">
				{/* Header with toggle button */}
				<div className="flex items-center justify-between border-b p-4">
					{isOpen && <h3 className="font-semibold">Tool Sidebar</h3>}
					<Button
						className="h-8 w-8 p-0"
						onClick={onToggle}
						size="sm"
						variant="ghost"
					>
						{isOpen ? (
							<ChevronsLeft className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Tool-specific content */}
				{isOpen && (
					<ScrollArea className="flex-1 p-4">{renderToolContent()}</ScrollArea>
				)}
			</div>
		</div>
	);
}

function HomeSidebarContent() {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-medium text-sm">Quick Access</h4>
				<div className="space-y-2">
					<Button className="w-full justify-start gap-2" variant="ghost">
						<Folder className="h-4 w-4" />
						Recent Projects
					</Button>
					<Button className="w-full justify-start gap-2" variant="ghost">
						<Star className="h-4 w-4" />
						Favorites
					</Button>
					<Button className="w-full justify-start gap-2" variant="ghost">
						<Clock className="h-4 w-4" />
						Recent Activity
					</Button>
				</div>
			</div>
			<Separator />
			<div>
				<h4 className="mb-2 font-medium text-sm">Dashboard Tools</h4>
				<div className="space-y-2">
					<Button className="w-full justify-start" variant="ghost">
						Create New
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Import Data
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Export Reports
					</Button>
				</div>
			</div>
		</div>
	);
}

function DocumentsSidebarContent() {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-medium text-sm">Documents</h4>
				<div className="space-y-2">
					<Button className="w-full justify-start" variant="ghost">
						All Documents
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Shared with Me
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Trash
					</Button>
				</div>
			</div>
		</div>
	);
}

function AnalyticsSidebarContent() {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-medium text-sm">Analytics</h4>
				<div className="space-y-2">
					<Button className="w-full justify-start" variant="ghost">
						Overview
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Reports
					</Button>
					<Button className="w-full justify-start" variant="ghost">
						Data Insights
					</Button>
				</div>
			</div>
		</div>
	);
}

function SettingsSidebarContent() {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-2 font-medium text-sm">Settings</h4>
				<div className="space-y-2">
					<Button className="w-full justify-start gap-2" variant="ghost">
						<Settings className="h-4 w-4" />
						General
					</Button>
					<Button className="w-full justify-start gap-2" variant="ghost">
						<User className="h-4 w-4" />
						Account
					</Button>
					<Button className="w-full justify-start gap-2" variant="ghost">
						<Database className="h-4 w-4" />
						Data & Privacy
					</Button>
				</div>
			</div>
		</div>
	);
}

function DefaultSidebarContent() {
	return (
		<div className="flex h-full items-center justify-center">
			<p className="text-muted-foreground">Select a tool to see options</p>
		</div>
	);
}
