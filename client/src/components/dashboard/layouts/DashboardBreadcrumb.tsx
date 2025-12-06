
import { ChevronRight, Home } from "lucide-react";

export function DashboardBreadcrumb() {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <Home className="h-4 w-4 mr-2" />
      <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
      <span className="font-medium text-foreground">Dashboard</span>
    </nav>
  );
}
