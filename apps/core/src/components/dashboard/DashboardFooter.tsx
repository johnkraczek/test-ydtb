
"use client";

import { useTheme } from "next-themes";
import { ThemeSwitcher } from "@ydtb/ui/base/theme-switcher";

export function DashboardFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm px-8 py-2 mt-auto">
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-xs">
          © 2024 Acme Corp. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-xs font-medium">
          <ThemeSwitcher
            value={theme as "light" | "dark" | "system"}
            onChange={setTheme}
            defaultValue="system"
          />

          <a className="transition-colors hover:text-primary" href="#">
            Documentation
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            Support
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            Terms
          </a>
          <a className="transition-colors hover:text-primary" href="#">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
