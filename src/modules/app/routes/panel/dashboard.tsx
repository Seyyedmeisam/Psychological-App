import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/dashboard')({
  component: lazy(() => import('@/modules/app/pages/AdminDashboardPage')),
})
