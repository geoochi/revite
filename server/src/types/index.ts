export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  expiresAt: string
  token: string
  userId: string
  createdAt: string
  updatedAt: string
  ipAddress?: string
  userAgent?: string
}

export interface AuthResponse {
  user: User
  session: Session
  accessToken: string
}

export interface SigninInput {
  email: string
  password: string
}

export interface SignupInput extends SigninInput {
  name?: string
}
