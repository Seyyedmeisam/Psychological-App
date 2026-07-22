import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/contact')({
  head: () =>
    buildPageHead({
      title: m.contact_title(),
      description: m.contact_subtitle(),
      path: '/contact',
      keywords: m.seo_keywords_contact(),
    }),
  component: lazy(() => import('@/modules/app/pages/ContactPage')),
})
