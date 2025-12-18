"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "@ydtb/core/context/theme/use-theme-color";
import { ThemePatternProvider } from "@ydtb/core/context/theme/use-theme-pattern";
import { SessionProvider } from "@ydtb/core/context/session/session-provider";
import { WorkspaceProvider } from "@ydtb/core/context/workspace/workspace-provider";
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