/**
 * Color tokens baked from the web app's src/index.css oklch() design system
 * (see /home/user/hisen/src/index.css and src/lib/accent-themes.ts) into
 * static hex values, since React Native has no oklch() support. Keep these
 * two files in sync if the web palette changes.
 */

export type ThemeMode = 'light' | 'dark'
export type AccentColor = 'blue' | 'emerald' | 'amber' | 'violet'

interface BaseColors {
  background: string
  foreground: string
  card: string
  popover: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  destructive: string
  destructiveForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  info: string
  infoForeground: string
  border: string
  input: string
  sidebar: string
  sidebarForeground: string
  sidebarBorder: string
}

interface AccentColors {
  primary: string
  primaryForeground: string
  ring: string
  sidebarAccent: string
  sidebarAccentForeground: string
  accent: string
  accentForeground: string
  chart1: string
}

export const BASE: Record<ThemeMode, BaseColors> = {
  light: {
    background: '#fdfdfe',
    foreground: '#0f141d',
    card: '#ffffff',
    popover: '#ffffff',
    secondary: '#eff2f6',
    secondaryForeground: '#1b2130',
    muted: '#f1f3f7',
    mutedForeground: '#5e636f',
    destructive: '#d40924',
    destructiveForeground: '#f6f9fc',
    success: '#2e9e52',
    successForeground: '#f0fdf1',
    warning: '#e49e22',
    warningForeground: '#372508',
    info: '#008bc7',
    infoForeground: '#f2fafe',
    border: '#dfe1e5',
    input: '#dfe1e5',
    sidebar: '#f9fafb',
    sidebarForeground: '#292e38',
    sidebarBorder: '#dfe1e5',
  },
  dark: {
    background: '#1e1f21',
    foreground: '#edeef1',
    card: '#2a2b2e',
    popover: '#2a2b2e',
    secondary: '#343538',
    secondaryForeground: '#edeef1',
    muted: '#313335',
    mutedForeground: '#9b9fa3',
    destructive: '#e64343',
    destructiveForeground: '#f6f9fc',
    success: '#45b164',
    successForeground: '#030f05',
    warning: '#e9ab2b',
    warningForeground: '#1f1401',
    info: '#16a4e2',
    infoForeground: '#010d16',
    border: '#ffffff1f',
    input: '#ffffff29',
    sidebar: '#242527',
    sidebarForeground: '#dcdee1',
    sidebarBorder: '#ffffff1a',
  },
}

export const ACCENTS: Record<AccentColor, { label: string; swatch: string; light: AccentColors; dark: AccentColors }> = {
  blue: {
    label: 'Ocean Blue',
    swatch: '#3b7dd8',
    light: { primary: '#0054a5', primaryForeground: '#f6f9fc', ring: '#4283cb', sidebarAccent: '#e4ecf5', sidebarAccentForeground: '#162f4b', accent: '#e7f1fe', accentForeground: '#10345a', chart1: '#0063ba' },
    dark: { primary: '#66a8f4', primaryForeground: '#091018', ring: '#5192dc', sidebarAccent: '#2e3e52', sidebarAccentForeground: '#e4e8ef', accent: '#27394f', accentForeground: '#e4e8ef', chart1: '#4d9bf2' },
  },
  emerald: {
    label: 'Emerald',
    swatch: '#1a9c57',
    light: { primary: '#00793d', primaryForeground: '#f3fbf5', ring: '#349d62', sidebarAccent: '#dcede1', sidebarAccentForeground: '#09311b', accent: '#dcf2e3', accentForeground: '#05381e', chart1: '#008a48' },
    dark: { primary: '#43c07a', primaryForeground: '#031108', ring: '#33a868', sidebarAccent: '#294433', sidebarAccentForeground: '#deece2', accent: '#21402c', accentForeground: '#deece2', chart1: '#32b36e' },
  },
  amber: {
    label: 'Amber',
    swatch: '#e0942f',
    light: { primary: '#c87600', primaryForeground: '#261704', ring: '#ce871b', sidebarAccent: '#f6e5cf', sidebarAccentForeground: '#462d0b', accent: '#fbe8ce', accentForeground: '#4f3005', chart1: '#cf7d00' },
    dark: { primary: '#f0a646', primaryForeground: '#211201', ring: '#d8953d', sidebarAccent: '#523e27', sidebarAccentForeground: '#f4e9dd', accent: '#4e381f', accentForeground: '#f4e9dd', chart1: '#e69c3a' },
  },
  violet: {
    label: 'Violet',
    swatch: '#8a5cd6',
    light: { primary: '#7541b8', primaryForeground: '#f9f7fe', ring: '#956ed2', sidebarAccent: '#eee7fd', sidebarAccentForeground: '#392855', accent: '#f1ebfd', accentForeground: '#402b5f', chart1: '#8254c4' },
    dark: { primary: '#ba93fb', primaryForeground: '#140e1d', ring: '#a37fde', sidebarAccent: '#443a56', sidebarAccentForeground: '#e9e6f1', accent: '#3e3451', accentForeground: '#e9e6f1', chart1: '#ad87ed' },
  },
}

export type Colors = BaseColors & AccentColors

export function resolveColors(mode: ThemeMode, accent: AccentColor): Colors {
  return { ...BASE[mode], ...ACCENTS[accent][mode] }
}
