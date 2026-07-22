import { env } from '@/core/configs/env'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'

export type PageSeoInput = {
  title: string
  description: string
  /** Absolute path starting with `/`, e.g. `/about` */
  path?: string
  keywords?: string
  image?: string
  noIndex?: boolean
  type?: 'website' | 'article'
  /** When true, use `title` as-is (no `| AppName` suffix). */
  absoluteTitle?: boolean
}

type HeadMeta =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }

type HeadLink = {
  rel: string
  href: string
  type?: string
  sizes?: string
}

type HeadScript = {
  type: string
  children: string
}

export type PageHead = {
  meta: HeadMeta[]
  links: HeadLink[]
  scripts?: HeadScript[]
}

function absoluteUrl(path?: string): string | undefined {
  if (!env.siteUrl) return undefined
  if (!path || path === '/') return env.siteUrl
  return `${env.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function defaultOgImage(): string | undefined {
  if (!env.siteUrl) return undefined
  return `${env.siteUrl}/pwa/icon-512.png`
}

function ogLocale(locale: string): string {
  const map: Record<string, string> = {
    fa: 'fa_IR',
    en: 'en_US',
    ar: 'ar_SA',
    tr: 'tr_TR',
    ru: 'ru_RU',
    zh: 'zh_CN',
  }
  return map[locale] ?? locale
}

/** Shared SEO head payload for route `head()` — works in SPA now and SSR later. */
export function buildPageHead(input: PageSeoInput): PageHead {
  const title = input.absoluteTitle
    ? input.title
    : `${input.title} | ${env.appName}`

  const url = absoluteUrl(input.path)
  const image = input.image ?? defaultOgImage()
  const locale = getLocale()
  const robots = input.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  const meta: HeadMeta[] = [
    { title },
    { name: 'description', content: input.description },
    { name: 'robots', content: robots },
    { name: 'author', content: env.appName },
    { property: 'og:title', content: title },
    { property: 'og:description', content: input.description },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:site_name', content: env.appName },
    { property: 'og:locale', content: ogLocale(locale) },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: input.description },
  ]

  if (input.keywords) {
    meta.push({ name: 'keywords', content: input.keywords })
  }
  if (url) {
    meta.push({ property: 'og:url', content: url })
  }
  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image },
    )
  }

  const links: HeadLink[] = []
  if (url) {
    links.push({ rel: 'canonical', href: url })
  }

  return { meta, links }
}

/** Organization + WebSite JSON-LD for the marketing home page. */
export function buildHomeJsonLd(description: string): HeadScript {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: env.appName,
    description,
    logo: absoluteUrl('/pwa/icon-512.png'),
  }

  if (env.siteUrl) {
    data.url = env.siteUrl
    data['@id'] = `${env.siteUrl}/#organization`
  }

  return {
    type: 'application/ld+json',
    children: JSON.stringify(data),
  }
}

export function buildWebSiteJsonLd(description: string): HeadScript {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: env.appName,
    description,
    inLanguage: getLocale(),
  }

  if (env.siteUrl) {
    data.url = env.siteUrl
  }

  return {
    type: 'application/ld+json',
    children: JSON.stringify(data),
  }
}
