import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuthToken } from '@/modules/auth/utils/routeGuards'
import { buildPageHead } from '@/core/seo/pageHead'
import { m } from '@/core/i18n/paraglide/messages.js'

export const Route = createFileRoute('/_panel')({
  beforeLoad: () => {
    requireAuthToken()
  },
  head: () =>
    buildPageHead({
      title: m.app_name(),
      description: m.seo_panel_description(),
      noIndex: true,
      absoluteTitle: true,
    }),
  component: lazy(() => import('@/modules/app/layouts/CtPanelLayout')),
})
