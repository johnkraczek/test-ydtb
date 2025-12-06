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
  storageKey = "vite-ui-theme-color",
}: ThemeColorProviderProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) as ThemeColor) || defaultThemeColor
  )

  useEffect(() => {
    const root = window.document.body
    root.classList.remove(
      "theme-zinc",
      "theme-slate",
      "theme-stone",
      "theme-gray",
      "theme-neutral",
      "theme-red",
      "theme-rose",
      "theme-orange",
      "theme-green",
      "theme-blue",
      "theme-yellow",
      "theme-violet"
    )
    root.classList.add(`theme-${themeColor}`)
  }, [themeColor])

  const value = {
    themeColor,
    setThemeColor: (theme: ThemeColor) => {
      localStorage.setItem(storageKey, theme)
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
