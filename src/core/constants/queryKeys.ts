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
  areasOfExpertise: ['areas-of-expertise'] as const,
  mentorsForArea: (areaId: number) =>
    ['areas-of-expertise', areaId, 'mentors'] as const,
  mentorExpertise: ['mentor', 'expertise'] as const,
  appointments: ['appointments'] as const,
  appointmentSlots: (filters: Record<string, unknown>) =>
    ['appointments', 'slots', filters] as const,
  adminStats: ['admin', 'stats'] as const,
  mentorProfile: ['mentor', 'profile'] as const,
} as const
