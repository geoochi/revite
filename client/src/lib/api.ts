import axios from 'axios'
import { AuthResponse, LoginInput, RegisterInput, User } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
    localStorage.removeItem('accessToken')
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export default api
