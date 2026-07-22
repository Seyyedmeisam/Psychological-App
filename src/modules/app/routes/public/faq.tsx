import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/faq')({
  head: () =>
    buildPageHead({
      title: m.faq_title(),
      description: m.faq_subtitle(),
      path: '/faq',
      keywords: m.seo_keywords_faq(),
    }),
  component: lazy(() => import('@/modules/app/pages/FaqPage')),
})
