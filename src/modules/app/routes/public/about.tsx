import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/about')({
  head: () =>
    buildPageHead({
      title: m.about_title(),
      description: m.about_description(),
      path: '/about',
      keywords: m.seo_keywords_about(),
    }),
  component: lazy(() => import('@/modules/app/pages/AboutPage')),
})
