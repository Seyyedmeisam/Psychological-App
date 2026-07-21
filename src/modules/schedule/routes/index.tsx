import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/schedule/')({
  beforeLoad: () => requireRoles(['mentor']),
  component: lazy(() => import('@/modules/schedule/pages/MentorSchedulePage')),
})
