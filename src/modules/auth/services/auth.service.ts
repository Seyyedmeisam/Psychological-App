import { requestHandler } from '@/core/api/requestHandler'
import { authService } from '@/modules/auth/services/authService'
import type {
  AuthResponse,
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from '@/modules/auth/types/auth.types'

type AuthPayload = { data: AuthResponse }

export const register = async (values: RegisterFormValues) => {
  const response = await requestHandler.post<AuthPayload>(authService.register(), values)
  return response.data.data
}

export const login = async (values: LoginFormValues) => {
  const response = await requestHandler.post<AuthPayload>(authService.login(), values)
  return response.data.data
}

export const getMe = async () => {
  const response = await requestHandler.get<{ data: AuthUser }>(authService.me())
  return response.data.data
}

export const logout = async () => {
  await requestHandler.post(authService.logout())
}
