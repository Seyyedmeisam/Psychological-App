import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: lazy(() => import('@/modules/app/layouts/CtPublicLayout')),
})
