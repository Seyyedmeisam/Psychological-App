import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireApprovedMentor } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/schedule/')({
  beforeLoad: () => requireApprovedMentor(),
  component: lazy(() => import('@/modules/schedule/pages/MentorSchedulePage')),
})
