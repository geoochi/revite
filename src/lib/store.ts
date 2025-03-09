import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))

export default useAuthStore
