import axios from 'axios'
import { AuthResponse, SigninInput, SignupInput, User } from '../types'

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
  signin: async (data: SigninInput): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/signin', data)
      return response.data
    } catch (error: any) {
      throw error.response.data.error
    }
  },

  signup: async (data: SignupInput): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/signup', data)
      return response.data
    } catch (error: any) {
      throw error.response.data.error
    }
  },

  signout: async (): Promise<void> => {
    await api.post('/api/auth/signout')
    localStorage.removeItem('accessToken')
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export default api
