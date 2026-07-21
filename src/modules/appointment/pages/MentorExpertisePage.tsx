import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { CtExpertiseSelectCard } from '@/modules/appointment/components/CtExpertiseSelectCard'
import {
  useAreasOfExpertise,
  useMyExpertise,
  useUpdateMyExpertise,
} from '@/modules/appointment/hooks'
import { cn } from '@/lib/utils'

export default function MentorExpertisePage() {
  const areasQuery = useAreasOfExpertise()
  const myExpertiseQuery = useMyExpertise()
  const updateMutation = useUpdateMyExpertise()
  const [selected, setSelected] = useState<number[]>([])

  useEffect(() => {
    if (myExpertiseQuery.data) {
      setSelected(myExpertiseQuery.data)
    }
  }, [myExpertiseQuery.data])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const dirty = useMemo(() => {
    const saved = myExpertiseQuery.data ?? []
    if (saved.length !== selected.length) return true
    return selected.some((id) => !saved.includes(id))
  }, [myExpertiseQuery.data, selected])

  const toggle = (id: number, checked: boolean) => {
    setSelected((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id]
      }
      return prev.filter((item) => item !== id)
    })
  }

  return (
    <section className="relative isolate w-full flex-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(90%_60%_at_100%_0%,oklch(0.92_0.04_230/0.7),transparent_55%),radial-gradient(70%_50%_at_0%_100%,oklch(0.93_0.03_200/0.55),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-s-16 top-8 -z-10 size-56 rounded-full bg-primary/10 blur-3xl motion-safe:animate-[login-breathe_9s_ease-in-out_infinite]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <CtCard
        variant="plain"
        className="expertise-hero mb-8 overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-0 shadow-ios-md backdrop-blur-xl"
      >
        <CtCardHeader className="relative gap-3 px-6 py-6 sm:px-8 sm:py-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-e-0 top-0 size-40 bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl space-y-2 text-start">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="size-4" aria-hidden />
                {m.nav_expertise()}
              </p>
              <CtCardTitle className="text-2xl sm:text-3xl">
                {m.expertise_title()}
              </CtCardTitle>
              <CtCardDescription className="text-sm leading-relaxed sm:text-base">
                {m.expertise_subtitle()}
              </CtCardDescription>
            </div>

            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition-colors duration-(--motion-duration-fast)',
                selected.length > 0
                  ? 'border-primary/30 bg-primary/10 text-foreground'
                  : 'border-border bg-secondary/80 text-muted-foreground',
              )}
            >
              <CheckCircle2
                className={cn(
                  'size-4 transition-transform duration-(--motion-duration-normal) ease-(--motion-ease-spring)',
                  selected.length > 0 && 'scale-110 text-primary',
                )}
                aria-hidden
              />
              <span className="font-medium tabular-nums">
                {m.expertise_selected_count({ count: String(selected.length) })}
              </span>
            </div>
          </div>
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={areasQuery.isLoading || myExpertiseQuery.isLoading}
        isError={areasQuery.isError || myExpertiseQuery.isError}
        errorMessage={
          areasQuery.error?.message ?? myExpertiseQuery.error?.message
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(areasQuery.data ?? []).map((area, index) => (
            <CtExpertiseSelectCard
              key={area.id}
              name={area.name}
              nameEn={area.name_en}
              slug={area.slug}
              checked={selectedSet.has(area.id)}
              onCheckedChange={(checked) => toggle(area.id, checked)}
              delayMs={80 + index * 55}
            />
          ))}
        </div>

        <div className="sticky bottom-4 z-20 mt-8 flex justify-center">
          <div className="flex w-full max-w-lg items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-ios-md backdrop-blur-xl">
            <p className="text-start text-sm text-muted-foreground">
              {m.expertise_selected_count({ count: String(selected.length) })}
            </p>
            <CtButton
              type="button"
              size="lg"
              disabled={updateMutation.isPending || !dirty}
              className="transition-transform duration-(--motion-duration-fast) hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => updateMutation.mutate(selected)}
            >
              {updateMutation.isPending ? <CtSpinner className="size-4" /> : null}
              {m.expertise_save()}
            </CtButton>
          </div>
        </div>
      </CtAsyncContent>
      </div>
    </section>
  )
}
