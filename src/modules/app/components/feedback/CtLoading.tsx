import { m } from '@/core/i18n/paraglide/messages.js'
import { CtSpinner } from '@/modules/app/components/CtSpinner'

export function CtLoading() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-8">
      <CtSpinner className="size-8 text-primary" />
      <span className="text-sm text-muted-foreground">{m.common_loading()}</span>
    </div>
  )
}
