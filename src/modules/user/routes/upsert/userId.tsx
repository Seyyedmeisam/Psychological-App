import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/users/upsert/userId')({
  component: lazy(() => import('@/modules/user/pages/UserUpsertPage')),
})
