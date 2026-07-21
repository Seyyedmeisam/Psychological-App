import axios from 'axios'
import { env } from '@/core/configs/env'
import { getAuthToken, setAuthToken } from '@/modules/auth/constants/auth'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

let redirectingToLogin = false

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const requestUrl = error.config?.url ?? ''
    const isCredentialRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register')

    // Failed login/register should show form errors, not bounce away
    if (isCredentialRequest) {
      return Promise.reject(error)
    }

    setAuthToken(null)

    if (typeof window !== 'undefined' && !redirectingToLogin) {
      const onLoginPage = window.location.pathname.includes('/login')
      if (!onLoginPage) {
        redirectingToLogin = true
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)
