import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  buildHomeJsonLd,
  buildPageHead,
  buildWebSiteJsonLd,
} from '@/core/seo/pageHead'

export const Route = createFileRoute('/_public/')({
  head: () => {
    const description = m.home_description()
    const head = buildPageHead({
      title: `${m.app_name()} — ${m.home_title()}`,
      description,
      path: '/',
      keywords: m.seo_keywords_home(),
      absoluteTitle: true,
    })

    return {
      ...head,
      scripts: [buildHomeJsonLd(description), buildWebSiteJsonLd(description)],
    }
  },
  component: lazy(() => import('@/modules/app/pages/HomePage')),
})
