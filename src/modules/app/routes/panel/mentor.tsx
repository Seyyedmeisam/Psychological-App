import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'
import { requireRoles } from '@/modules/auth/utils/routeGuards'

export const Route = createFileRoute('/_panel/mentor')({
  beforeLoad: () => requireRoles(['mentor']),
  head: () =>
    buildPageHead({
      title: m.mentor_home_title(),
      description: m.seo_panel_description(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/app/pages/MentorHomePage')),
})
