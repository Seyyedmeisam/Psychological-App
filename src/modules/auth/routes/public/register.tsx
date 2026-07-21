import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/register')({
  component: lazy(() => import('@/modules/auth/pages/RegisterPage')),
})
