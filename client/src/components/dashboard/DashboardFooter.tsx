
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Laptop } from "lucide-react";

export function DashboardFooter() {
  const { setTheme } = useTheme();

  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm px-8 py-2 mt-auto">
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-xs">
          © 2024 Acme Corp. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-xs font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
