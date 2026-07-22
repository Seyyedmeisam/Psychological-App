import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/privacy')({
  head: () =>
    buildPageHead({
      title: m.privacy_title(),
      description: m.privacy_subtitle(),
      path: '/privacy',
      keywords: m.seo_keywords_privacy(),
      type: 'article',
    }),
  component: lazy(() => import('@/modules/app/pages/PrivacyPolicyPage')),
})
