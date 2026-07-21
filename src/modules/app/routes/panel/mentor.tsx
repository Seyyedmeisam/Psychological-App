import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/mentor')({
  beforeLoad: () => requireRoles(['mentor']),
  component: lazy(() => import('@/modules/app/pages/MentorHomePage')),
})
