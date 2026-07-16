import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/appointments/book')({
  component: lazy(() => import('@/modules/appointment/pages/BookAppointmentPage')),
})
