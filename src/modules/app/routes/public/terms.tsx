import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/terms')({
  head: () =>
    buildPageHead({
      title: m.terms_title(),
      description: m.terms_subtitle(),
      path: '/terms',
      keywords: m.seo_keywords_terms(),
      type: 'article',
    }),
  component: lazy(() => import('@/modules/app/pages/TermsPage')),
})
