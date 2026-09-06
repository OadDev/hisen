import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Role } from '@/types/rbac'
import { api, ApiError, setApiToken } from '@/lib/api-client'

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
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  /** Demo-only: re-filter the sidebar/dashboards as another role without a real re-login. */
  switchRole: (role: Role) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const { token, user } = await api.post<LoginResponse>('/auth/login', { email, password })
        setApiToken(token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        const token = get().token
        setApiToken(null)
        set({ user: null, token: null, isAuthenticated: false })
        if (token) {
          api.post('/auth/logout').catch(() => {})
        }
      },
      switchRole: (role) => set((state) => (state.user ? { user: { ...state.user, role } } : state)),
    }),
    {
      name: 'hisen-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setApiToken(state.token)
      },
    },
  ),
)

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}
