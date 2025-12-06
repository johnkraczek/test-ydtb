export function DashboardFooter() {
	return (
		<footer className="border-t border-l border-r border-b bg-muted/30 px-6 py-3 rounded-bl-lg rounded-br-lg">
			<div className="flex items-center justify-between">
				<div className="text-muted-foreground text-sm">
					© 2024 Your Company. All rights reserved.
				</div>
				<div className="flex items-center gap-4 text-muted-foreground text-sm">
					<a className="transition-colors hover:text-foreground" href="#">
						Documentation
					</a>
					<a className="transition-colors hover:text-foreground" href="#">
						Support
					</a>
					<a className="transition-leftcolors hover:text-foreground" href="#">
						Terms
					</a>
					<a className="transition-colors hover:text-foreground" href="#">
						Privacy
					</a>
				</div>
			</div>
		</footer>
	);
}
