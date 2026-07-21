import { rtlLocales } from '@/core/i18n/localeLabels'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'

export type DocumentDirection = 'rtl' | 'ltr'

export const isRtlLocale = (locale: string) =>
  (rtlLocales as readonly string[]).includes(locale)

export const getDocumentDirection = (
  locale: string = getLocale(),
): DocumentDirection => (isRtlLocale(locale) ? 'rtl' : 'ltr')

export const getHtmlLang = (locale: string = getLocale()) => locale

/** Keep `<html>` (and body) in sync with the active language. */
export function applyDocumentLocale(locale: string) {
  const lang = getHtmlLang(locale)
  const dir = getDocumentDirection(locale)
  const root = document.documentElement

  root.lang = lang
  root.dir = dir
  document.body.dir = dir

  return { lang, dir }
}
