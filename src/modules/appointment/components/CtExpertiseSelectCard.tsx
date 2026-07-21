import {
  Baby,
  BookOpen,
  Brain,
  Flame,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  Users,
  UserRound,
  Waves,
} from 'lucide-react'
import { CtCheckbox } from '@/modules/app/components/CtCheckbox'
import { cn } from '@/lib/utils'

const iconBySlug: Record<string, typeof Brain> = {
  'child-psychology': Baby,
  'adolescent-psychology': UserRound,
  'couples-therapy': HeartHandshake,
  'anxiety-stress': Waves,
  depression: Brain,
  'family-therapy': Users,
  'self-esteem': Sparkles,
  'learning-disorders': BookOpen,
  'trauma-ptsd': HeartPulse,
  addiction: Flame,
}

function iconForSlug(slug: string) {
  return iconBySlug[slug] ?? Brain
}

export function CtExpertiseSelectCard({
  name,
  nameEn,
  slug,
  checked,
  onCheckedChange,
  delayMs = 0,
}: Readonly<{
  name: string
  nameEn?: string | null
  slug: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  delayMs?: number
}>) {
  const Icon = iconForSlug(slug)

  return (
    <label
      className={cn(
        'expertise-card group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-4 text-start shadow-ios-sm outline-none transition-[transform,box-shadow,border-color,background-color] duration-(--motion-duration-normal) ease-(--motion-ease-out)',
        'hover:-translate-y-1 hover:shadow-ios-md',
        'focus-within:ring-2 focus-within:ring-ring/25',
        checked
          ? 'border-primary/50 bg-primary/10 shadow-ios-md ring-1 ring-primary/20'
          : 'border-border/80 bg-card/90 hover:border-primary/25',
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-e-10 -top-10 size-28 rounded-full blur-2xl transition-opacity duration-(--motion-duration-slow)',
          checked
            ? 'bg-primary/25 opacity-100'
            : 'bg-primary/10 opacity-0 group-hover:opacity-70',
        )}
      />

      <span className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-xl transition-[transform,background-color,color] duration-(--motion-duration-normal) ease-(--motion-ease-spring)',
            checked
              ? 'scale-105 bg-primary text-primary-foreground shadow-ios-sm'
              : 'bg-secondary text-foreground/75 group-hover:bg-accent group-hover:text-accent-foreground',
          )}
        >
          <Icon className="size-5" />
        </span>

        <CtCheckbox
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="mt-0.5"
          aria-label={name}
        />
      </span>

      <span className="relative mt-4 space-y-1">
        <span
          className={cn(
            'block text-sm font-semibold tracking-tight transition-colors',
            checked ? 'text-foreground' : 'text-foreground/90',
          )}
        >
          {name}
        </span>
        {nameEn ? (
          <span className="block text-xs leading-relaxed text-muted-foreground">
            {nameEn}
          </span>
        ) : null}
      </span>

      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-primary transition-transform duration-(--motion-duration-normal) ease-(--motion-ease-out)',
          checked && 'scale-x-100',
        )}
      />
    </label>
  )
}
