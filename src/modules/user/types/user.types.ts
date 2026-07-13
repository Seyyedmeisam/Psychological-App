export type UserRole = 'admin' | 'user' | 'mentor'

export type User = {
  id: number
  name: string
  mobile: string
  email?: string | null
  role: UserRole
  created_at?: string
}

export type UserFormValues = {
  name: string
  mobile: string
  email?: string
  password?: string
  password_confirmation?: string
  role: UserRole
}

export type UsersListParams = {
  page?: number
  per_page?: number
  search?: string
  role?: UserRole
  [key: string]: unknown
}
