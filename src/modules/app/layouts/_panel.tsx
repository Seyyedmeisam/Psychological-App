import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthToken } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel')({
  beforeLoad: () => {
    requireAuthToken()
  },
  component: lazy(() => import('@/modules/app/layouts/CtPanelLayout')),
})
