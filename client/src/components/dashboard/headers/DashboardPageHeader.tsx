
import { DashboardBreadcrumb } from "../layouts/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

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
    <div className={`flex items-center justify-between ${isBorderVisible ? "border-b" : ""} bg-white/50 backdrop-blur-sm px-8 py-4 transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <DashboardBreadcrumb />
        {title && (
          <>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="font-display font-semibold text-sm tracking-tight text-slate-900">{title}</h1>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions || (
          <>
             <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
