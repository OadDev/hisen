import { useEffect } from 'react'
import { useUiStore } from '@/stores/ui-store'
import { applyAccentTheme } from '@/lib/accent-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme)
  const accentColor = useUiStore((s) => s.accentColor)

  useEffect(() => {
    const root = window.document.documentElement
    const apply = (t: 'light' | 'dark') => {
      root.classList.toggle('dark', t === 'dark')
      applyAccentTheme(root, accentColor, t)
    }

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mql.matches ? 'dark' : 'light')
      const listener = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light')
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    }

    apply(theme)
  }, [theme, accentColor])

  return <>{children}</>
}
