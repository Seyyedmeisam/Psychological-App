export const queryKeys = {
  me: ['auth', 'me'] as const,
  books: ['books'] as const,
  booksList: (params?: Record<string, unknown>) =>
    ['books', 'list', params] as const,
  booksInfinite: (params?: Record<string, unknown>) =>
    ['books', 'infinite', params] as const,
  book: (id: number) => ['books', id] as const,
  users: ['users'] as const,
  usersList: (params?: Record<string, unknown>) =>
    ['users', 'list', params] as const,
  usersInfinite: (params?: Record<string, unknown>) =>
    ['users', 'infinite', params] as const,
  user: (id: number) => ['users', id] as const,

} as const
