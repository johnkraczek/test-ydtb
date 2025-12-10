import { createContext, useContext, useEffect, useState } from "react"

export type ThemePattern = "none" | "dots" | "grid" | "graph" | "noise"

type ThemePatternProviderProps = {
  children: React.ReactNode
  defaultThemePattern?: ThemePattern
  storageKey?: string
}

type ThemePatternState = {
  themePattern: ThemePattern
  setThemePattern: (pattern: ThemePattern) => void
}

const initialState: ThemePatternState = {
  themePattern: "dots",
  setThemePattern: () => null,
}

const ThemePatternProviderContext = createContext<ThemePatternState>(initialState)

export function ThemePatternProvider({
  children,
  defaultThemePattern = "dots",
  storageKey = "vite-ui-theme-pattern",
}: ThemePatternProviderProps) {
  const [themePattern, setThemePattern] = useState<ThemePattern>(
    () => (localStorage.getItem(storageKey) as ThemePattern) || defaultThemePattern
  )

  const value = {
    themePattern,
    setThemePattern: (pattern: ThemePattern) => {
      localStorage.setItem(storageKey, pattern)
      setThemePattern(pattern)
    },
  }

  return (
    <ThemePatternProviderContext.Provider value={value}>
      {children}
    </ThemePatternProviderContext.Provider>
  )
}

export const useThemePattern = () => {
  const context = useContext(ThemePatternProviderContext)

  if (context === undefined)
    throw new Error("useThemePattern must be used within a ThemePatternProvider")

  return context
}
