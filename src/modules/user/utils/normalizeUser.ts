import type { User, UserFormValues } from '@/modules/user/types/user.types'

const hasDataField = (value: object): value is { data: unknown } => 'data' in value

export const normalizeUsers = (payload: unknown): User[] => {
  if (Array.isArray(payload)) return payload as User[]
  if (payload && typeof payload === 'object' && hasDataField(payload)) {
    const { data } = payload
    return Array.isArray(data) ? (data as User[]) : []
  }
  return []
}

export const normalizeUser = (payload: unknown): User | null => {
  if (!payload || typeof payload !== 'object') return null
  if (hasDataField(payload) && payload.data) {
    return payload.data as User
  }
  return payload as User
}

export const userToFormValues = (user?: User | null): UserFormValues => ({
  name: user?.name ?? '',
  mobile: user?.mobile ?? '',
  email: user?.email ?? '',
  password: '',
  password_confirmation: '',
  role: user?.role ?? 'user',
})
