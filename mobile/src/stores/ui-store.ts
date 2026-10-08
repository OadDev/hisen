import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { AccentColor, ThemeMode } from '@/lib/theme'

interface UiState {
  theme: ThemeMode
  accentColor: AccentColor
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (accent: AccentColor) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: 'blue',
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: 'hisen-ui',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
