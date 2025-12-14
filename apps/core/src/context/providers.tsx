"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "~/context/theme/use-theme-color";
import { ThemePatternProvider } from "~/context/theme/use-theme-pattern";
import { SessionProvider } from "~/context/session/session-provider";
import { WorkspaceProvider } from "~/context/workspace/workspace-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeColorProvider>
          <ThemePatternProvider>
            <SessionProvider>
              <WorkspaceProvider>
                {children}
              </WorkspaceProvider>
            </SessionProvider>
          </ThemePatternProvider>
        </ThemeColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}