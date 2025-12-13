"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "~/hooks/use-theme-color";
import { ThemePatternProvider } from "~/hooks/use-theme-pattern";

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
          {children}
        </ThemePatternProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  );
}