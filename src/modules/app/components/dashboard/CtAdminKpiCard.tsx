import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type CtAdminKpiCardProps = {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const TONE_ICON = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-[oklch(0.62_0.17_145/0.14)] text-[oklch(0.45_0.14_145)]',
  warning: 'bg-[oklch(0.75_0.15_75/0.18)] text-[oklch(0.5_0.12_75)]',
  danger: 'bg-destructive/10 text-destructive',
} as const

export function CtAdminKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
  className,
}: Readonly<CtAdminKpiCardProps>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card px-5 py-4 shadow-ios-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <span
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
            TONE_ICON[tone],
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </div>
  )
}
