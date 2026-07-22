import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'
import { requireApprovedMentor } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/schedule/')({
  beforeLoad: () => requireApprovedMentor(),
  head: () =>
    buildPageHead({
      title: m.nav_schedule(),
      description: m.seo_panel_description(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/schedule/pages/MentorSchedulePage')),
})
