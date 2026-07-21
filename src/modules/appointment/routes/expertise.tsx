import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/appointments/expertise')({
  component: lazy(() => import('@/modules/appointment/pages/MentorExpertisePage')),
})
