import { redirect } from '@tanstack/react-router'
import { getAuthToken, setAuthToken } from '@/modules/auth/constants/auth'
import { getMe } from '@/modules/auth/services'
import type { UserRole } from '@/modules/auth/types'
import { getHomePathByRole } from '@/modules/auth/utils/homePath'

/** Require a stored auth token (SPA panel shell). */
export function requireAuthToken() {
  if (!getAuthToken()) {
    throw redirect({ to: '/login' })
  }
}

/** Require auth + one of the allowed roles; otherwise send user to their home. */
export async function requireRoles(roles: readonly UserRole[]) {
  requireAuthToken()

  let user
  try {
    user = await getMe()
  } catch {
    setAuthToken(null)
    throw redirect({ to: '/login' })
  }

  if (!roles.includes(user.role)) {
    throw redirect({ to: getHomePathByRole(user.role) })
  }

  return user
}
