import type { AppLocale } from '@/core/i18n/localeLabels'
import { rtlLocales } from '@/core/i18n/localeLabels'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'

export const isRtlLocale = (locale: string): locale is AppLocale =>
  (rtlLocales as readonly string[]).includes(locale)

export const getDocumentDirection = (locale = getLocale()) =>
  isRtlLocale(locale) ? 'rtl' : 'ltr'

export const getHtmlLang = (locale = getLocale()) => locale
