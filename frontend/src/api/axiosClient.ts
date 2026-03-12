import axios, { type InternalAxiosRequestConfig } from 'axios'
import { authStorageKeys } from '../constants/auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

export const axiosClient = axios.create({
  baseURL: apiBaseUrl ?? 'http://localhost:8080/api',
})

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(authStorageKeys.accessToken)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true
      const refreshToken = window.localStorage.getItem(
        authStorageKeys.refreshToken,
      )

      if (!refreshToken) {
        window.localStorage.removeItem(authStorageKeys.accessToken)
        window.localStorage.removeItem(authStorageKeys.authUser)
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(
          `${apiBaseUrl ?? 'http://localhost:8080/api'}/auth/refresh`,
          {
            refreshToken,
          },
        )

        const { accessToken: newAccessToken } = refreshResponse.data
        window.localStorage.setItem(
          authStorageKeys.accessToken,
          newAccessToken,
        )

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }

        return axiosClient(originalRequest)
      } catch {
        window.localStorage.removeItem(authStorageKeys.accessToken)
        window.localStorage.removeItem(authStorageKeys.refreshToken)
        window.localStorage.removeItem(authStorageKeys.authUser)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

