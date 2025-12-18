"use client"

import { useThemePattern } from "@ydtb/core/context/theme/use-theme-pattern"
import { useActiveTool } from "@ydtb/core/hooks/use-active-tool"

interface ThemedContentAreaProps {
  children: React.ReactNode
}

export function ThemedContentArea({ children }: ThemedContentAreaProps) {
  const { getPatternClass } = useThemePattern()
  const activeTool = useActiveTool()
  const patternClass = getPatternClass(activeTool)

  return (
    <div className={`relative h-full ${patternClass}`}>
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50" />
      <div className="relative p-8">
        {children}
      </div>
    </div>
  )
}