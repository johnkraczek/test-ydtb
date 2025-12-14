"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "~/context/theme/use-theme-color";
import { ThemePatternProvider } from "~/context/theme/use-theme-pattern";
import { SessionProvider } from "~/context/session/session-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColorProvider>
        <ThemePatternProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemePatternProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  );
}