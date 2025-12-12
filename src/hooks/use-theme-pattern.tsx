"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type ThemePattern = "none" | "dots" | "grid" | "graph" | "noise"

type ThemePatternProviderProps = {
  children: React.ReactNode
  defaultThemePattern?: ThemePattern
  storageKey?: string
}

type ThemePatternState = {
  themePattern: ThemePattern
  setThemePattern: (pattern: ThemePattern) => void
  getPatternClass: (activeTool?: string) => string
}

const initialState: ThemePatternState = {
  themePattern: "dots",
  setThemePattern: () => null,
  getPatternClass: () => "",
}

const ThemePatternProviderContext = createContext<ThemePatternState>(initialState)

export function ThemePatternProvider({
  children,
  defaultThemePattern = "dots",
  storageKey = "ui-theme-pattern",
}: ThemePatternProviderProps) {
  const [themePattern, setThemePattern] = useState<ThemePattern>(defaultThemePattern)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedPattern = localStorage.getItem(storageKey) as ThemePattern
    if (savedPattern) {
      setThemePattern(savedPattern)
    }
  }, [storageKey])

  const getPatternClass = (activeTool?: string) => {
    if (activeTool === "messages") return "";
    switch (themePattern) {
      case "dots": return "bg-dot-pattern";
      case "grid": return "bg-grid-pattern";
      case "graph": return "bg-graph-paper";
      case "noise": return "bg-noise";
      default: return "";
    }
  };

  const value = {
    themePattern,
    setThemePattern: (pattern: ThemePattern) => {
      if (mounted) {
        localStorage.setItem(storageKey, pattern)
      }
      setThemePattern(pattern)
    },
    getPatternClass,
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
