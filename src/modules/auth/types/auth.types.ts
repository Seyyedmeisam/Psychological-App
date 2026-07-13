export type UserRole = 'admin' | 'user' | 'mentor'

export type AuthUser = {
  id: number
  name: string
  mobile: string
  email?: string | null
  role: UserRole
  created_at?: string
}

export type LoginFormValues = {
  mobile: string
  password: string
}

export type RegisterFormValues = {
  name: string
  mobile: string
  password: string
  password_confirmation: string
  role: 'user' | 'mentor'
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
