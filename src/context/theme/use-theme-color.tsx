"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeColor = "zinc" | "slate" | "stone" | "gray" | "neutral" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet"

type ThemeColorProviderProps = {
  children: React.ReactNode
  defaultThemeColor?: ThemeColor
  storageKey?: string
}

type ThemeColorState = {
  themeColor: ThemeColor
  setThemeColor: (theme: ThemeColor) => void
}

const initialState: ThemeColorState = {
  themeColor: "zinc",
  setThemeColor: () => null,
}

const ThemeColorProviderContext = createContext<ThemeColorState>(initialState)

export function ThemeColorProvider({
  children,
  defaultThemeColor = "zinc",
  storageKey = "ui-theme-color",
}: ThemeColorProviderProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(defaultThemeColor)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(storageKey) as ThemeColor
    if (savedTheme) {
      setThemeColor(savedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.setAttribute('data-theme-color', themeColor)
  }, [themeColor, mounted])

  const value = {
    themeColor,
    setThemeColor: (theme: ThemeColor) => {
      if (mounted) {
        localStorage.setItem(storageKey, theme)
      }
      setThemeColor(theme)
    },
  }

  return (
    <ThemeColorProviderContext.Provider value={value}>
      {children}
    </ThemeColorProviderContext.Provider>
  )
}

export const useThemeColor = () => {
  const context = useContext(ThemeColorProviderContext)

  if (context === undefined)
    throw new Error("useThemeColor must be used within a ThemeColorProvider")

  return context
}
