import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/users/upsert/')({
  component: lazy(() => import('@/modules/user/pages/UserUpsertPage')),
})
