import type { Book, BookFormValues } from '@/modules/book/types/book.types'

const hasDataField = (value: object): value is { data: unknown } => 'data' in value

export const normalizeBooks = (payload: unknown): Book[] => {
  if (Array.isArray(payload)) return payload as Book[]
  if (payload && typeof payload === 'object' && hasDataField(payload)) {
    const { data } = payload
    return Array.isArray(data) ? (data as Book[]) : []
  }
  return []
}

export const normalizeBook = (payload: unknown): Book | null => {
  if (!payload || typeof payload !== 'object') return null
  if (hasDataField(payload) && payload.data) {
    return payload.data as Book
  }
  return payload as Book
}

export const bookToFormValues = (book?: Book | null): BookFormValues => ({
  title: book?.title ?? '',
  author: book?.author ?? '',
  description: book?.description ?? '',
  status: book?.status ?? 'draft',
  cover: null,
})

export const toBookFormData = (values: BookFormValues) => {
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('author', values.author)
  if (values.description) formData.append('description', values.description)
  if (values.status) formData.append('status', values.status)
  if (values.cover?.[0]) formData.append('cover', values.cover[0])
  return formData
}
