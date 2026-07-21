import type { User, UserFormValues } from '@/modules/user/types/user.types'
import type { PaginatedMeta, PaginatedResult } from '@/core/types/pagination.types'
import { emptyPaginatedMeta } from '@/core/types/pagination.types'

const hasDataField = (value: object): value is { data: unknown } => 'data' in value

const asUserArray = (value: unknown): User[] =>
  Array.isArray(value) ? (value as User[]) : []

export const normalizeUsers = (payload: unknown): User[] => {
  if (Array.isArray(payload)) return payload as User[]
  if (payload && typeof payload === 'object' && hasDataField(payload)) {
    return asUserArray(payload.data)
  }
  return []
}

export const normalizePaginatedUsers = (
  payload: unknown,
): PaginatedResult<User> => {
  if (Array.isArray(payload)) {
    return {
      data: payload as User[],
      meta: {
        ...emptyPaginatedMeta(),
        total: payload.length,
        per_page: payload.length || 15,
        from: payload.length ? 1 : null,
        to: payload.length || null,
      },
    }
  }

  if (!payload || typeof payload !== 'object') {
    return { data: [], meta: emptyPaginatedMeta() }
  }

  const record = payload as Record<string, unknown>
  const data = asUserArray(record.data)

  const metaSource =
    record.meta && typeof record.meta === 'object'
      ? (record.meta as Record<string, unknown>)
      : record

  const meta: PaginatedMeta = {
    current_page: Number(metaSource.current_page ?? 1) || 1,
    last_page: Number(metaSource.last_page ?? 1) || 1,
    per_page: Number(metaSource.per_page ?? (data.length || 15)) || 15,
    total: Number(metaSource.total ?? data.length) || 0,
    from:
      metaSource.from === null || metaSource.from === undefined
        ? data.length
          ? 1
          : null
        : Number(metaSource.from),
    to:
      metaSource.to === null || metaSource.to === undefined
        ? data.length || null
        : Number(metaSource.to),
  }

  return { data, meta }
}

export const normalizeUser = (payload: unknown): User | null => {
  if (!payload || typeof payload !== 'object') return null
  if (hasDataField(payload) && payload.data && !Array.isArray(payload.data)) {
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
