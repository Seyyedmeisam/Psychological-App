import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_panel/profile/')({
  head: () =>
    buildPageHead({
      title: m.nav_profile(),
      description: m.seo_panel_description(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/auth/pages/ProfilePage')),
})
