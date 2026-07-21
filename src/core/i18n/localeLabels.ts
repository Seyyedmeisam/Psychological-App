export const localeLabels = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
  tr: 'Türkçe',
  ru: 'Русский',
  zh: '中文',
} as const

export type AppLocale = keyof typeof localeLabels

export const rtlLocales = ['ar', 'fa'] as const satisfies readonly AppLocale[]
