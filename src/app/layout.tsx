import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '~/index.css'
import { ThemeProvider } from "~/components/theme-provider"
import { ThemeColorProvider } from "~/hooks/use-theme-color"
import { ThemePatternProvider } from "~/hooks/use-theme-pattern"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM Toolbox',
  description: 'A modern CRM toolbox for professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="ui-theme"
        >
          <ThemeColorProvider
            defaultThemeColor="zinc"
            storageKey="ui-theme-color"
          >
            <ThemePatternProvider
              defaultThemePattern="dots"
              storageKey="ui-theme-pattern"
            >
              {children}
            </ThemePatternProvider>
          </ThemeColorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}