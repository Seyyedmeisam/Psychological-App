import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function CtAppointmentStatusBadge({
  label,
  tone = 'default',
}: Readonly<{
  label: string
  tone?: 'default' | 'success' | 'muted' | 'danger' | 'warning' | 'info' | 'pink'
}>) {
  return (
    <span
      className={cn(
        'inline-flex rounded-lg px-2 py-0.5 text-xs font-medium',
        tone === 'success' && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        tone === 'muted' && 'bg-muted text-muted-foreground',
        tone === 'danger' && 'bg-destructive/15 text-destructive',
        tone === 'warning' && 'bg-amber-400/20 text-amber-900 dark:text-amber-300',
        tone === 'info' && 'bg-sky-500/15 text-sky-800 dark:text-sky-300',
        tone === 'pink' && 'bg-pink-400/20 text-pink-800 dark:text-pink-300',
        tone === 'default' && 'bg-primary/10 text-foreground',
      )}
    >
      {label}
    </span>
  )
}

export function CtAppointmentCardShell({
  className,
  children,
}: Readonly<{ className?: string; children: ReactNode }>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card px-4 py-4 shadow-ios-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
