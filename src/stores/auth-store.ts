import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/types/rbac'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  department: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
  switchRole: (role: Role) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) =>
        set((state) => (state.user ? { user: { ...state.user, role } } : state)),
    }),
    { name: 'hisen-auth' },
  ),
)
