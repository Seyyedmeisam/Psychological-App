import { useEffect, useState } from 'react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import {
  CtCard,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtWeekScheduleGrid } from '@/modules/schedule/components/CtWeekScheduleGrid'
import {
  useAvailabilityTemplate,
  useMyAvailability,
  useUpdateMyAvailability,
} from '@/modules/schedule/hooks'
import type { AvailabilitySlotInput } from '@/modules/schedule/types'

export default function MentorSchedulePage() {
  const templateQuery = useAvailabilityTemplate()
  const availabilityQuery = useMyAvailability()
  const updateMutation = useUpdateMyAvailability()

  const [draft, setDraft] = useState<AvailabilitySlotInput[]>([])

  useEffect(() => {
    if (availabilityQuery.data) {
      setDraft(
        availabilityQuery.data.slots.map((slot) => ({
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
        })),
      )
    }
  }, [availabilityQuery.data])

  const templateSlots =
    availabilityQuery.data?.template_slots ?? templateQuery.data?.slots ?? []

  const isLoading = templateQuery.isLoading || availabilityQuery.isLoading
  const isError = templateQuery.isError || availabilityQuery.isError
  const errorMessage =
    templateQuery.error?.message ?? availabilityQuery.error?.message

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.schedule_title()}</CtCardTitle>
          <CtCardDescription>{m.schedule_subtitle()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {m.schedule_help({
              session: String(templateQuery.data?.session_minutes ?? 90),
              breakMinutes: String(templateQuery.data?.break_minutes ?? 15),
            })}
          </p>
          <CtButton
            type="button"
            onClick={() => updateMutation.mutate(draft)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <CtSpinner className="size-4" /> : null}
            {m.schedule_save()}
          </CtButton>
        </div>

        <CtWeekScheduleGrid
          templateSlots={templateSlots}
          selected={draft.map((slot) => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: '',
          }))}
          onChange={setDraft}
        />
      </CtAsyncContent>
    </section>
  )
}
