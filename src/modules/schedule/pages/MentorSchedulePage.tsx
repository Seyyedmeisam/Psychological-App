import { useEffect, useState } from 'react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import {
  CtAlert,
  CtAlertDescription,
} from '@/modules/app/components/CtAlert'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import {
  useMyAppointments,
  useUpdateAppointmentStatus,
} from '@/modules/appointment/hooks'
import type { AppointmentStatusValue } from '@/modules/appointment/types'
import { CtAppointmentsWeekGrid } from '@/modules/schedule/components/CtAppointmentsWeekGrid'
import { CtWeekScheduleGrid } from '@/modules/schedule/components/CtWeekScheduleGrid'
import {
  useAvailabilityTemplate,
  useMyAvailability,
  useUpdateMyAvailability,
} from '@/modules/schedule/hooks'
import type { AvailabilitySlotInput } from '@/modules/schedule/types'
import { cn } from '@/lib/utils'

type ScheduleTab = 'appointments' | 'availability'

export default function MentorSchedulePage() {
  const [tab, setTab] = useState<ScheduleTab>('appointments')
  const templateQuery = useAvailabilityTemplate()
  const availabilityQuery = useMyAvailability()
  const updateMutation = useUpdateMyAvailability()
  const appointmentsQuery = useMyAppointments({
    refetchInterval: 60_000,
  })
  const statusMutation = useUpdateAppointmentStatus()

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

  const isLoading =
    tab === 'availability'
      ? templateQuery.isLoading || availabilityQuery.isLoading
      : appointmentsQuery.isLoading || templateQuery.isLoading
  const isError =
    tab === 'availability'
      ? templateQuery.isError || availabilityQuery.isError
      : appointmentsQuery.isError || templateQuery.isError
  const errorMessage =
    tab === 'availability'
      ? (templateQuery.error?.message ?? availabilityQuery.error?.message)
      : (appointmentsQuery.error?.message ?? templateQuery.error?.message)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        title={m.schedule_page_title()}
        description={m.schedule_page_subtitle()}
      />

      <div
        className="mb-6 inline-flex rounded-2xl border border-border bg-card p-1 shadow-ios-sm"
        role="tablist"
        aria-label={m.schedule_page_title()}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'appointments'}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
            tab === 'appointments'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
          onClick={() => setTab('appointments')}
        >
          {m.schedule_tab_appointments()}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'availability'}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
            tab === 'availability'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
          onClick={() => setTab('availability')}
        >
          {m.schedule_tab_availability()}
        </button>
      </div>

      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
      >
        {tab === 'appointments' ? (
          <div className="space-y-4">
            <CtAlert>
              <CtAlertDescription>
                {m.schedule_appointments_help()}
              </CtAlertDescription>
            </CtAlert>
            <CtAppointmentsWeekGrid
              templateSlots={templateSlots}
              appointments={appointmentsQuery.data ?? []}
              statusPendingId={
                statusMutation.isPending
                  ? statusMutation.variables.appointmentId
                  : null
              }
              onUpdateStatus={(appointmentId, status: AppointmentStatusValue) => {
                statusMutation.mutate({ appointmentId, status })
              }}
            />
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <CtAlert className="min-w-0 flex-1">
                <CtAlertDescription>
                  {m.schedule_help({
                    session: String(templateQuery.data?.session_minutes ?? 90),
                    breakMinutes: String(templateQuery.data?.break_minutes ?? 15),
                  })}
                </CtAlertDescription>
              </CtAlert>
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
          </>
        )}
      </CtAsyncContent>
    </section>
  )
}
