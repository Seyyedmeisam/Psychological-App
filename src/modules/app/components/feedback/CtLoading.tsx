import { m } from '@/core/i18n/paraglide/messages.js'
import { Spinner } from '@/modules/app/components/ui/spinner'

export function CtLoading() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-8">
      <Spinner className="size-8 text-primary" />
      <span className="text-sm text-muted-foreground">{m.common_loading()}</span>
    </div>
  )
}
