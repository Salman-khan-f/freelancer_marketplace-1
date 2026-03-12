import { axiosClient } from './axiosClient'
import type { AuthUser } from '../context/AuthContext'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'admin' | 'company' | 'freelancer'
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await axiosClient.post<any>('/auth/login', payload)
    // Map backend JwtResponse to AuthResponse
    return {
      accessToken: data.token,
      refreshToken: '', // Backend doesn't provide refresh token yet
      user: {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase() as any,
      },
    }
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await axiosClient.post<any>('/auth/register', payload)
    // Map backend JwtResponse to AuthResponse
    return {
      accessToken: data.token,
      refreshToken: '',
      user: {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase() as any,
      },
    }
  },
}

