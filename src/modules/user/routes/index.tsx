import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/users/')({
  component: lazy(() => import('@/modules/user/pages/UsersListPage')),
})
