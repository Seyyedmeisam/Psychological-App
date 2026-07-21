import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Direction } from 'radix-ui'
import type { AppLocale } from '@/core/i18n/localeLabels'
import {
  applyDocumentLocale,
  getDocumentDirection,
} from '@/core/i18n/locale'
import type { DocumentDirection } from '@/core/i18n/locale'
import { getLocale, setLocale as setParaglideLocale } from '@/core/i18n/paraglide/runtime.js'

type I18nContextValue = {
  locale: AppLocale
  dir: DocumentDirection
  setAppLocale: (locale: AppLocale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function CtI18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocale] = useState<AppLocale>(() => getLocale())
  const dir = getDocumentDirection(locale)

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir,
      setAppLocale: (nextLocale) => {
        setParaglideLocale(nextLocale, { reload: false })
        applyDocumentLocale(nextLocale)
        setLocale(nextLocale)
      },
    }),
    [dir, locale],
  )

  return (
    <I18nContext.Provider value={value}>
      <Direction.Provider dir={dir}>{children}</Direction.Provider>
    </I18nContext.Provider>
  )
}

export const useAppLocale = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useAppLocale must be used within CtI18nProvider')
  }
  return context
}
