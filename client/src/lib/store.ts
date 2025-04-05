import { defineStore } from 'pinia'

interface User {
  email: string
  name?: string
  emailVerified: boolean
  image?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export default defineStore('auth', {
  state: (): AuthState => ({ user: null, isAuthenticated: false }),

  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated
    },
  },
})
