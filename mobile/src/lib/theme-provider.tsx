import { createContext, useContext, useMemo } from 'react'
import { useUiStore } from '@/stores/ui-store'
import { resolveColors, type Colors } from '@/lib/theme'

const ThemeContext = createContext<Colors | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme)
  const accentColor = useUiStore((s) => s.accentColor)
  const colors = useMemo(() => resolveColors(theme, accentColor), [theme, accentColor])

  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>
}

export function useColors(): Colors {
  const colors = useContext(ThemeContext)
  if (!colors) throw new Error('useColors must be used within a ThemeProvider')
  return colors
}
