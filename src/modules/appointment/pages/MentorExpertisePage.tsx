import { useEffect, useState } from 'react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
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

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.expertise_title()}</CtCardTitle>
          <CtCardDescription>{m.expertise_subtitle()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={areasQuery.isLoading || myExpertiseQuery.isLoading}
        isError={areasQuery.isError || myExpertiseQuery.isError}
        errorMessage={
          areasQuery.error?.message ?? myExpertiseQuery.error?.message
        }
      >
        <div className="mb-4 flex justify-end">
          <CtButton
            type="button"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate(selected)}
          >
            {updateMutation.isPending ? <CtSpinner className="size-4" /> : null}
            {m.expertise_save()}
          </CtButton>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(areasQuery.data ?? []).map((area) => {
            const active = selected.includes(area.id)
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => toggle(area.id)}
                className={cn(
                  'ios-press rounded-2xl border px-4 py-4 text-start transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
                )}
              >
                <span className="block text-sm font-semibold">{area.name}</span>
                {area.name_en ? (
                  <span className="mt-1 block text-xs opacity-70">
                    {area.name_en}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </CtAsyncContent>
    </section>
  )
}
