import {
  localeLabels,
  type AppLocale,
} from '@/core/i18n/localeLabels'
import { locales } from '@/core/i18n/paraglide/runtime.js'
import { useAppLocale } from '@/modules/app/providers/CtI18nProvider'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import { m } from '@/core/i18n/paraglide/messages.js'

export function CtLocaleSwitcher() {
  const { locale, setAppLocale } = useAppLocale()

  return (
    <CtSelectRoot value={locale} onValueChange={(value) => setAppLocale(value as AppLocale)}>
      <CtSelectTrigger className="w-[9.5rem]" size="sm" aria-label={m.locale_label()}>
        <CtSelectValue placeholder={m.locale_label()} />
      </CtSelectTrigger>
      <CtSelectContent>
        {locales.map((code) => (
          <CtSelectItem key={code} value={code}>
            {localeLabels[code as AppLocale]}
          </CtSelectItem>
        ))}
      </CtSelectContent>
    </CtSelectRoot>
  )
}
