import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/schedule/')({
  component: lazy(() => import('@/modules/schedule/pages/MentorSchedulePage')),
})
