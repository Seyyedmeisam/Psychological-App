import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/profile/')({
  component: lazy(() => import('@/modules/auth/pages/ProfilePage')),
})
