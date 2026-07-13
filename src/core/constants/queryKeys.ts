export const queryKeys = {
  me: ['auth', 'me'] as const,
  books: ['books'] as const,
  booksList: (params?: Record<string, unknown>) =>
    ['books', 'list', params] as const,
  booksInfinite: (params?: Record<string, unknown>) =>
    ['books', 'infinite', params] as const,
  book: (id: number) => ['books', id] as const,
} as const
