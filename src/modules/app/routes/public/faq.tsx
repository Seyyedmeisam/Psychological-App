import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/faq')({
  component: lazy(() => import('@/modules/app/pages/FaqPage')),
})
