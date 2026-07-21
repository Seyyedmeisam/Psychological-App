import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/dashboard')({
  beforeLoad: () => requireRoles(['admin']),
  component: lazy(() => import('@/modules/app/pages/AdminDashboardPage')),
})
