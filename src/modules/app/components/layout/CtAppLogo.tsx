import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'

type CtAppLogoProps = Readonly<{
  className?: string
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
}>

const sizeMap = {
  sm: 'size-7',
  md: 'size-8',
  lg: 'size-10',
} as const

export function CtAppLogo({
  className,
  showWordmark = true,
  size = 'md',
}: CtAppLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex min-w-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-90',
        className,
      )}
      aria-label={m.app_name()}
    >
      <img
        src="/brand/logo.svg"
        alt=""
        width={40}
        height={40}
        className={cn('shrink-0 rounded-[22%]', sizeMap[size])}
        decoding="async"
      />
      {showWordmark ? (
        <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {m.app_name()}
        </span>
      ) : null}
    </Link>
  )
}
