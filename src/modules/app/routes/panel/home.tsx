import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/home')({
  component: lazy(() => import('@/modules/app/pages/ClientHomePage')),
})
