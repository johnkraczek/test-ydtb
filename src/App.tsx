import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "~/components/ui/toaster";
import { TooltipProvider } from "~/components/ui/tooltip";
import DashboardPage from "./app/dashboard/page";


function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route component={() => <div>Page not found</div>} />
    </Switch>
  );
}

import { ThemeProvider } from "~/components/theme-provider";
import { ThemeColorProvider } from "~/hooks/use-theme-color";
import { ThemePatternProvider } from "~/hooks/use-theme-pattern";
import { MediaProvider } from "~/context/media-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class" enableSystem>
        <ThemeColorProvider defaultThemeColor="zinc" storageKey="vite-ui-theme-color">
          <ThemePatternProvider defaultThemePattern="dots" storageKey="vite-ui-theme-pattern">
            <MediaProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </MediaProvider>
          </ThemePatternProvider>
        </ThemeColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
