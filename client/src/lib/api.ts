import axios from 'axios'

// console.log('MODE:', import.meta.env.MODE)
// console.log('VITE_BUILD_ENV:', import.meta.env.VITE_BUILD_ENV)
// console.log('VITE_SERVER_URL:', import.meta.env.VITE_SERVER_URL)
// console.log('VITE_REMOTE_SERVER_URL:', import.meta.env.VITE_REMOTE_SERVER_URL)

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BUILD_ENV === 'remote'
      ? import.meta.env.VITE_REMOTE_SERVER_URL
      : import.meta.env.VITE_SERVER_URL,
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

export default api
