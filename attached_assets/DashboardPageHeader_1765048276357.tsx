"use client";

import { DashboardBreadcrumb } from "../layouts/DashboardBreadcrumb";

interface DashboardPageHeaderProps {
	title?: string;
	description?: string;
	actions?: React.ReactNode;
	isBorderVisible?: boolean;
}

export function DashboardPageHeader({
	title,
	description,
	actions,
	isBorderVisible = true,
}: DashboardPageHeaderProps) {
	return (
		<div className={`flex items-center justify-between ${isBorderVisible ? "border-t" : ""} border-b border-r bg-muted/30 px-6 py-4 rounded-tr-lg`}>
			<div className="flex items-center gap-4">
				<div>
					{title && (
						<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
					)}
					{description && (
						<p className="mt-1 text-muted-foreground text-sm">{description}</p>
					)}
				</div>
			</div>
			<div className="flex items-center gap-4">
				<DashboardBreadcrumb />
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</div>
		</div>
	);
}
