import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/contact')({
  component: lazy(() => import('@/modules/app/pages/ContactPage')),
})
