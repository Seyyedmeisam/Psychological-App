import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppLocale } from '@/core/i18n/localeLabels'
import { getDocumentDirection, getHtmlLang } from '@/core/i18n/locale'
import { getLocale, setLocale } from '@/core/i18n/paraglide/runtime.js'

type I18nContextValue = {
  locale: AppLocale
  setAppLocale: (locale: AppLocale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function CtI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => getLocale() as AppLocale)

  useEffect(() => {
    const direction = getDocumentDirection(locale)
    document.documentElement.lang = getHtmlLang(locale)
    document.documentElement.dir = direction
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setAppLocale: (nextLocale) => {
        setLocale(nextLocale, { reload: false })
        setLocaleState(nextLocale)
      },
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useAppLocale = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useAppLocale must be used within CtI18nProvider')
  }
  return context
}
