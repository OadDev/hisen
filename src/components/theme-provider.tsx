import { useEffect } from 'react'
import { useUiStore } from '@/stores/ui-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    const root = window.document.documentElement
    const apply = (t: 'light' | 'dark') => {
      root.classList.toggle('dark', t === 'dark')
    }

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mql.matches ? 'dark' : 'light')
      const listener = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light')
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    }

    apply(theme)
  }, [theme])

  return <>{children}</>
}
