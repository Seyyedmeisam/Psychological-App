import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/appointments/book')({
  beforeLoad: () => requireRoles(['user']),
  head: () =>
    buildPageHead({
      title: m.appointment_book_title(),
      description: m.appointment_book_subtitle(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/appointment/pages/BookAppointmentPage')),
})
