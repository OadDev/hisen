export type AccentColor = 'blue' | 'emerald' | 'amber' | 'violet'

interface AccentVars {
  primary: string
  primaryForeground: string
  ring: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  accent: string
  accentForeground: string
  chart1: string
}

interface AccentTheme {
  label: string
  /** Swatch shown in the theme picker — a representative mid-tone of the accent hue. */
  swatch: string
  light: AccentVars
  dark: AccentVars
}

export const ACCENT_THEMES: Record<AccentColor, AccentTheme> = {
  blue: {
    label: 'Ocean Blue',
    swatch: 'oklch(0.55 0.16 253)',
    light: {
      primary: 'oklch(0.45 0.15 253)',
      primaryForeground: 'oklch(0.98 0.005 260)',
      ring: 'oklch(0.6 0.13 253)',
      sidebarPrimary: 'oklch(0.45 0.15 253)',
      sidebarPrimaryForeground: 'oklch(0.98 0.005 260)',
      sidebarAccent: 'oklch(0.94 0.015 253)',
      sidebarAccentForeground: 'oklch(0.3 0.06 253)',
      accent: 'oklch(0.955 0.02 253)',
      accentForeground: 'oklch(0.32 0.08 253)',
      chart1: 'oklch(0.5 0.16 253)',
    },
    dark: {
      primary: 'oklch(0.72 0.13 253)',
      primaryForeground: 'oklch(0.17 0.02 253)',
      ring: 'oklch(0.65 0.13 253)',
      sidebarPrimary: 'oklch(0.72 0.13 253)',
      sidebarPrimaryForeground: 'oklch(0.17 0.02 253)',
      sidebarAccent: 'oklch(0.36 0.04 253)',
      sidebarAccentForeground: 'oklch(0.93 0.01 260)',
      accent: 'oklch(0.34 0.045 253)',
      accentForeground: 'oklch(0.93 0.01 260)',
      chart1: 'oklch(0.68 0.15 253)',
    },
  },
  emerald: {
    label: 'Emerald',
    swatch: 'oklch(0.58 0.15 155)',
    light: {
      primary: 'oklch(0.5 0.14 155)',
      primaryForeground: 'oklch(0.98 0.01 155)',
      ring: 'oklch(0.62 0.13 155)',
      sidebarPrimary: 'oklch(0.5 0.14 155)',
      sidebarPrimaryForeground: 'oklch(0.98 0.01 155)',
      sidebarAccent: 'oklch(0.93 0.025 155)',
      sidebarAccentForeground: 'oklch(0.28 0.06 155)',
      accent: 'oklch(0.94 0.03 155)',
      accentForeground: 'oklch(0.3 0.07 155)',
      chart1: 'oklch(0.55 0.15 155)',
    },
    dark: {
      primary: 'oklch(0.72 0.15 155)',
      primaryForeground: 'oklch(0.16 0.03 155)',
      ring: 'oklch(0.65 0.14 155)',
      sidebarPrimary: 'oklch(0.72 0.15 155)',
      sidebarPrimaryForeground: 'oklch(0.16 0.03 155)',
      sidebarAccent: 'oklch(0.36 0.045 155)',
      sidebarAccentForeground: 'oklch(0.93 0.02 155)',
      accent: 'oklch(0.34 0.05 155)',
      accentForeground: 'oklch(0.93 0.02 155)',
      chart1: 'oklch(0.68 0.15 155)',
    },
  },
  amber: {
    label: 'Amber',
    swatch: 'oklch(0.72 0.15 70)',
    light: {
      primary: 'oklch(0.64 0.16 70)',
      primaryForeground: 'oklch(0.22 0.04 70)',
      ring: 'oklch(0.68 0.14 70)',
      sidebarPrimary: 'oklch(0.64 0.16 70)',
      sidebarPrimaryForeground: 'oklch(0.22 0.04 70)',
      sidebarAccent: 'oklch(0.93 0.035 75)',
      sidebarAccentForeground: 'oklch(0.32 0.06 70)',
      accent: 'oklch(0.94 0.04 75)',
      accentForeground: 'oklch(0.34 0.07 70)',
      chart1: 'oklch(0.66 0.16 70)',
    },
    dark: {
      primary: 'oklch(0.78 0.14 70)',
      primaryForeground: 'oklch(0.2 0.04 70)',
      ring: 'oklch(0.72 0.13 70)',
      sidebarPrimary: 'oklch(0.78 0.14 70)',
      sidebarPrimaryForeground: 'oklch(0.2 0.04 70)',
      sidebarAccent: 'oklch(0.38 0.045 70)',
      sidebarAccentForeground: 'oklch(0.94 0.02 70)',
      accent: 'oklch(0.36 0.05 70)',
      accentForeground: 'oklch(0.94 0.02 70)',
      chart1: 'oklch(0.75 0.14 70)',
    },
  },
  violet: {
    label: 'Violet',
    swatch: 'oklch(0.55 0.18 300)',
    light: {
      primary: 'oklch(0.5 0.18 300)',
      primaryForeground: 'oklch(0.98 0.01 300)',
      ring: 'oklch(0.62 0.15 300)',
      sidebarPrimary: 'oklch(0.5 0.18 300)',
      sidebarPrimaryForeground: 'oklch(0.98 0.01 300)',
      sidebarAccent: 'oklch(0.94 0.03 300)',
      sidebarAccentForeground: 'oklch(0.32 0.08 300)',
      accent: 'oklch(0.95 0.025 300)',
      accentForeground: 'oklch(0.34 0.09 300)',
      chart1: 'oklch(0.55 0.17 300)',
    },
    dark: {
      primary: 'oklch(0.74 0.15 300)',
      primaryForeground: 'oklch(0.18 0.03 300)',
      ring: 'oklch(0.67 0.14 300)',
      sidebarPrimary: 'oklch(0.74 0.15 300)',
      sidebarPrimaryForeground: 'oklch(0.18 0.03 300)',
      sidebarAccent: 'oklch(0.37 0.05 300)',
      sidebarAccentForeground: 'oklch(0.93 0.015 300)',
      accent: 'oklch(0.35 0.05 300)',
      accentForeground: 'oklch(0.93 0.015 300)',
      chart1: 'oklch(0.7 0.15 300)',
    },
  },
}

const CSS_VAR_MAP: Record<keyof AccentVars, string> = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  ring: '--ring',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  chart1: '--chart-1',
}

export function applyAccentTheme(root: HTMLElement, accent: AccentColor, mode: 'light' | 'dark') {
  const vars = ACCENT_THEMES[accent][mode]
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    root.style.setProperty(cssVar, vars[key as keyof AccentVars])
  }
}
