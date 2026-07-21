import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{m.not_found_title()}</h1>
      <p className="text-muted-foreground">{m.not_found_subtitle()}</p>
      <CtButton asChild>
        <Link to="/">{m.not_found_back()}</Link>
      </CtButton>
    </div>
  )
}
