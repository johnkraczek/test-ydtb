
"use client";

import { useActiveTool } from "~/hooks/use-active-tool";

interface ToolHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerContent?: React.ReactNode;
}

export function ToolHeader({
  title,
  description,
  headerContent
}: ToolHeaderProps) {
  const activeTool = useActiveTool();
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-8 py-6 transition-all duration-300">

      {headerContent ? (
        headerContent
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title || (
                activeTool === "users" ? "Contacts" :
                  activeTool === "media" ? "Media Storage" :
                    "Dashboard"
              )}
            </h1>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {description || (
                activeTool === "users" ? "Manage your team and contacts." :
                  activeTool === "media" ? "Manage and organize your media assets." :
                    "Here's what's happening with your projects today."
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
