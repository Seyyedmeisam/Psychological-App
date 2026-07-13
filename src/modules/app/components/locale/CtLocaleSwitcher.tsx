import {
  localeLabels,
  type AppLocale,
} from '@/core/i18n/localeLabels'
import { locales } from '@/core/i18n/paraglide/runtime.js'
import { useAppLocale } from '@/modules/app/providers/CtI18nProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/app/components/ui/select'
import { m } from '@/core/i18n/paraglide/messages.js'

export function CtLocaleSwitcher() {
  const { locale, setAppLocale } = useAppLocale()

  return (
    <Select value={locale} onValueChange={(value) => setAppLocale(value as AppLocale)}>
      <SelectTrigger className="w-[9.5rem]" size="sm" aria-label={m.locale_label()}>
        <SelectValue placeholder={m.locale_label()} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            {localeLabels[code as AppLocale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
