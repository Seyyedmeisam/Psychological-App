import { lazy, Suspense } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '@/core/styles/global.css?url'
import { getDocumentDirection, getHtmlLang } from '@/core/i18n/locale'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppProviders } from '@/modules/app/providers/CtAppProviders'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: m.app_name() },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
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
      <body>
        <CtAppProviders>
          <Suspense fallback={<CtLoading />}>{children}</Suspense>
        </CtAppProviders>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
