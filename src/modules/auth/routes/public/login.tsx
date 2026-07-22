import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/login')({
  head: () =>
    buildPageHead({
      title: m.auth_login(),
      description: m.auth_login_subtitle(),
      path: '/login',
      keywords: m.seo_keywords_login(),
    }),
  component: lazy(() => import('@/modules/auth/pages/LoginPage')),
})
