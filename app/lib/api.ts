import axios from 'axios'

const api = axios.create({
  withCredentials: true,
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
