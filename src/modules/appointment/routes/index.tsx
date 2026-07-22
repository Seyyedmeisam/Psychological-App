import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_panel/appointments/')({
  head: () =>
    buildPageHead({
      title: m.appointment_mine_title(),
      description: m.appointment_mine_subtitle(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/appointment/pages/MyAppointmentsPage')),
})
