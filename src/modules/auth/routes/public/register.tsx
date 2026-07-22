import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/register')({
  head: () =>
    buildPageHead({
      title: m.auth_register(),
      description: m.auth_register_subtitle(),
      path: '/register',
      keywords: m.seo_keywords_register(),
    }),
  component: lazy(() => import('@/modules/auth/pages/RegisterPage')),
})
