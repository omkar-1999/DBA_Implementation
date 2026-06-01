import axios from 'axios'
import { useLoaderStore } from '@/stores/loaderStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let activeRequests = 0

function startLoader() {
  const loader = useLoaderStore()

  activeRequests++

  if (activeRequests === 1) {
    loader.start()
  }
}

function stopLoader() {
  const loader = useLoaderStore()

  activeRequests--

  if (activeRequests <= 0) {
    activeRequests = 0
    loader.stop()
  }
}

api.interceptors.request.use(
  (config) => {
    startLoader()

    // optional auth token
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    stopLoader()
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    stopLoader()
    return response
  },
  (error) => {
    stopLoader()

    // timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }

    // unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')

      window.location.href = '/login'
    }

    // server error
    if (error.response?.status >= 500) {
      console.error('Server error')
    }

    // dev logging only
    if (import.meta.env.DEV) {
      console.error('API Error:', error)
    }

    return Promise.reject(error)
  },
)
console.log('BASE URL:', import.meta.env.VITE_API_BASE_URL)
export default api
