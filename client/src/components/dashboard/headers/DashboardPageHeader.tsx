
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
    <div className={`flex items-end justify-between ${isBorderVisible ? "border-b" : ""} bg-white/50 backdrop-blur-sm px-8 py-6 transition-all duration-300`}>
      <div className="flex flex-col gap-4">
        <DashboardBreadcrumb />
        <div>
          {title && (
            <h1 className="font-display font-bold text-3xl tracking-tight text-slate-900">{title}</h1>
          )}
          {description && (
            <p className="mt-2 text-slate-500 text-base max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-1">
        {actions || (
          <>
             <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2 bg-white">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
