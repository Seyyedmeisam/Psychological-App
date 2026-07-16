export const queryKeys = {
  me: ['auth', 'me'] as const,
  users: ['users'] as const,
  usersList: (params?: Record<string, unknown>) =>
    ['users', 'list', params] as const,
  usersInfinite: (params?: Record<string, unknown>) =>
    ['users', 'infinite', params] as const,
  user: (id: number) => ['users', id] as const,
  availability: ['availability'] as const,
  availabilityMine: ['availability', 'mine'] as const,
  availabilityTemplate: ['availability', 'template'] as const,
} as const
