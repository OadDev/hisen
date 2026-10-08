import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api, ApiError, setApiToken } from '@/lib/api-client'
import { tokenStorage } from '@/lib/token-storage'

const TOKEN_KEY = 'hisen-auth-token'

export type Role = 'super_admin' | 'sales' | 'production' | 'service' | 'finance' | 'inventory' | string

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  department: string
}

interface LoginResponse {
  token: string
  user: AuthUser
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  hydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,
      login: async (email, password) => {
        const { token, user } = await api.post<LoginResponse>('/auth/login', { email, password })
        await tokenStorage.setItem(TOKEN_KEY, token)
        setApiToken(token)
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        setApiToken(null)
        set({ user: null, isAuthenticated: false })
        tokenStorage.deleteItem(TOKEN_KEY).catch(() => {})
        api.post('/auth/logout').catch(() => {})
      },
      hydrate: async () => {
        const token = await tokenStorage.getItem(TOKEN_KEY)
        if (token) {
          setApiToken(token)
        } else if (get().isAuthenticated) {
          set({ user: null, isAuthenticated: false })
        }
        set({ hydrated: true })
      },
    }),
    {
      name: 'hisen-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}
