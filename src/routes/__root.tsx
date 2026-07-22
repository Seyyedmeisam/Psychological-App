import { lazy, Suspense } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '@/core/styles/global.css?url'
import { env } from '@/core/configs/env'
import { getDocumentDirection, getHtmlLang } from '@/core/i18n/locale'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppProviders } from '@/modules/app/providers/CtAppProviders'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'
import { CtTanStackDevtools } from '@/modules/app/components/feedback/CtTanStackDevtools'

export const Route = createRootRoute({
  head: () => {
    const title = `${m.app_name()} — ${m.home_title()}`
    const description = m.home_description()
    const ogImage = env.siteUrl ? `${env.siteUrl}/pwa/icon-512.png` : undefined

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title },
        { name: 'description', content: description },
        { name: 'application-name', content: m.app_name() },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: m.app_name() },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: m.app_name() },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        ...(ogImage
          ? [
              { property: 'og:image', content: ogImage },
              { name: 'twitter:image', content: ogImage },
            ]
          : []),
        { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { rel: 'icon', href: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
        {
          rel: 'apple-touch-icon',
          href: '/pwa/apple-touch-icon.png',
          sizes: '180x180',
        },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        ...(env.siteUrl ? [{ rel: 'canonical', href: env.siteUrl }] : []),
      ],
    }
  },
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: lazy(() => import('@/modules/app/pages/errors/NotFoundPage')),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = getLocale()
  const lang = getHtmlLang(locale)
  const dir = getDocumentDirection(locale)

  return (
    <html lang={lang} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body dir={dir}>
        {children}
        {import.meta.env.DEV ? <CtTanStackDevtools /> : null}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <CtAppProviders>
      <Suspense fallback={<CtLoading />}>
        <Outlet />
      </Suspense>
    </CtAppProviders>
  )
}
