import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/appointments/book')({
  beforeLoad: () => requireRoles(['user']),
  component: lazy(() => import('@/modules/appointment/pages/BookAppointmentPage')),
})
