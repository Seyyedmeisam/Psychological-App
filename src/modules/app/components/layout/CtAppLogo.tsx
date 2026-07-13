import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'

export function CtAppLogo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold text-primary">
      <Heart className="size-5 shrink-0 fill-current" aria-hidden />
      <span>{m.app_name()}</span>
    </Link>
  )
}
