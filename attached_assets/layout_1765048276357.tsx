"use client";

import { useState } from "react";
import { DashboardFooter } from "~/components/dashboard/DashboardFooter";
import { DashboardMainHeader } from "~/components/dashboard/headers/DashboardMainHeader";
import { DashboardPageHeader } from "~/components/dashboard/headers/DashboardPageHeader";
import { ToolIconsSidebar } from "~/components/dashboard/sidebars/ToolIconsSidebar";
import { ToolSidebar } from "~/components/dashboard/sidebars/ToolSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [activeTool, setActiveTool] = useState("home");
	const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-orange-50/30 to-rose-50/20">
			{/* RED - Main Header */}
			<DashboardMainHeader />

			<div className="flex flex-1 overflow-hidden pt-2 pl-2 pr-2">
				{/* GREEN - Tool Icons Sidebar - extends full height */}
				<ToolIconsSidebar
					activeTool={activeTool}
					onToolSelect={setActiveTool}
					isToolSidebarOpen={isToolSidebarOpen}
					onToggleSidebar={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
				/>

				{/* BLUE - Collapsible Tool Sidebar + WHITE - Main Content + YELLOW Footer */}
				<div className="flex flex-1 flex-col overflow-hidden">
					{/* BLUE - Collapsible Tool Sidebar + WHITE - Main Content */}
					<div className="flex flex-1 overflow-hidden">
						{/* BLUE - Collapsible Tool Sidebar */}
						<ToolSidebar
							isOpen={isToolSidebarOpen}
							onToggle={() => setIsToolSidebarOpen(!isToolSidebarOpen)}
							toolId={activeTool}
						/>

						{/* WHITE - Main Content Area */}
						<div className={`flex flex-1 flex-col overflow-hidden border-l border-r ${!isToolSidebarOpen ? "border-t rounded-tl-lg rounded-tr-lg" : ""}`}>
							{/* PINK - Page Header */}
							<DashboardPageHeader
								description="Welcome to your dashboard"
								title="Dashboard"
								isBorderVisible={isToolSidebarOpen}
							/>

							{/* Main content */}
							<div className="flex-1 overflow-auto p-6">{children}</div>
						</div>
					</div>

					{/* YELLOW - Footer - under sidebar and main content only */}
					<DashboardFooter />
					<div className="pb-2" />
				</div>
			</div>
		</div>
	);
}
