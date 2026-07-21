export type PaginatedMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export type PaginatedResult<T> = {
  data: T[]
  meta: PaginatedMeta
}

export const emptyPaginatedMeta = (): PaginatedMeta => ({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: null,
  to: null,
})
