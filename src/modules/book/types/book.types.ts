export type Book = {
  id: number
  title: string
  author: string
  description?: string | null
  status?: 'draft' | 'published'
}

export type BookFormValues = {
  title: string
  author: string
  description?: string
  status?: 'draft' | 'published'
  cover?: FileList | null
}

export type BooksListParams = {
  page?: number
  per_page?: number
  search?: string
  [key: string]: unknown
}
