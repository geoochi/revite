import axios from 'axios'

// console.log('MODE:', import.meta.env.MODE)
// console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
// console.log('VITE_PROD_API_URL:', import.meta.env.VITE_PROD_API_URL)

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_PROD_API_URL
      : import.meta.env.VITE_API_URL,
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
