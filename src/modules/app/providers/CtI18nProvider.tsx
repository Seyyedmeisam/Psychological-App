import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AppLocale } from '@/core/i18n/localeLabels'
import { getDocumentDirection, getHtmlLang } from '@/core/i18n/locale'
import { getLocale, setLocale as setParaglideLocale } from '@/core/i18n/paraglide/runtime.js'

type I18nContextValue = {
  locale: AppLocale
  setAppLocale: (locale: AppLocale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function CtI18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocale] = useState<AppLocale>(() => getLocale())

  useEffect(() => {
    const direction = getDocumentDirection(locale)
    document.documentElement.lang = getHtmlLang(locale)
    document.documentElement.dir = direction
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setAppLocale: (nextLocale) => {
        setParaglideLocale(nextLocale, { reload: false })
        setLocale(nextLocale)
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
