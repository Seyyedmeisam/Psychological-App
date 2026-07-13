import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/about')({
  component: lazy(() => import('@/modules/app/pages/AboutPage')),
})
