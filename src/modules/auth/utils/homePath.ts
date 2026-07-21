import type { UserRole } from '@/modules/auth/types'

export function getHomePathByRole(role: UserRole): '/dashboard' | '/home' | '/mentor' {
  if (role === 'admin') return '/dashboard'
  if (role === 'mentor') return '/mentor'
  return '/home'
}
