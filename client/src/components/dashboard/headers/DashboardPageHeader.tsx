
import { DashboardBreadcrumb } from "../layouts/DashboardBreadcrumb";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface DashboardPageHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  isBorderVisible?: boolean;
  breadcrumbs?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  actions,
  isBorderVisible = true,
  breadcrumbs,
}: DashboardPageHeaderProps) {
  const breadcrumbContent = breadcrumbs === undefined ? <DashboardBreadcrumb /> : breadcrumbs;

  return (
    <div className={`${isBorderVisible ? "border-b border-slate-200 dark:border-slate-800" : ""} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-8 py-6 transition-all duration-300`}>
       {breadcrumbContent && (
         <div className="mb-4">
            {breadcrumbContent}
         </div>
       )}
       
       <div className="flex items-start justify-between gap-4">
         <div className="space-y-1">
           {title && <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>}
           {description && <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>}
         </div>
         
         <div className="flex items-center gap-3">
            {actions || (
              <>
                 <Button variant="outline" size="sm" className="h-8 gap-2 bg-white dark:bg-slate-900 text-xs">
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-white dark:bg-slate-900 text-xs">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </>
            )}
         </div>
       </div>
    </div>
  );
}
