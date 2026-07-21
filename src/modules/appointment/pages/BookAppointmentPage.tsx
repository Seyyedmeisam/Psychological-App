import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppointmentWeekTimeline } from '@/modules/appointment/components/CtAppointmentWeekTimeline'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtLabel } from '@/modules/app/components/CtLabel'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import {
  useAreasOfExpertise,
  useAvailableSlots,
  useBookAppointment,
  useMentorsForArea,
} from '@/modules/appointment/hooks'
import type { AvailableSlot } from '@/modules/appointment/types'
import {
  addDaysIso,
  getSlotQueryRange,
  getWeekStartIso,
} from '@/modules/appointment/utils/weekTimeline'
import { cn } from '@/lib/utils'

export default function BookAppointmentPage() {
  const navigate = useNavigate()
  const areasQuery = useAreasOfExpertise()
  const [areaId, setAreaId] = useState<number | null>(null)
  const [weekStart, setWeekStart] = useState(() => getWeekStartIso())
  const [mentorId, setMentorId] = useState<string>('all')
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)

  const slotRange = useMemo(() => getSlotQueryRange(weekStart), [weekStart])
  const currentWeekStart = useMemo(() => getWeekStartIso(), [])

  const mentorsQuery = useMentorsForArea(areaId)
  const slotsQuery = useAvailableSlots(
    areaId
      ? {
          area_of_expertise_id: areaId,
          from: slotRange.from,
          to: slotRange.to,
          ...(mentorId !== 'all' ? { mentor_id: Number(mentorId) } : {}),
        }
      : null,
  )
  const bookMutation = useBookAppointment({
    onSuccess: () => {
      void navigate({ to: '/appointments' })
    },
  })

  useEffect(() => {
    setMentorId('all')
    setSelectedSlot(null)
  }, [areaId])

  useEffect(() => {
    setSelectedSlot(null)
  }, [mentorId, weekStart])

  const selectedArea = useMemo(
    () => areasQuery.data?.find((area) => area.id === areaId) ?? null,
    [areasQuery.data, areaId],
  )

  const canGoPrevWeek = weekStart > currentWeekStart

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.appointment_book_title()}</CtCardTitle>
          <CtCardDescription>{m.appointment_book_subtitle()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={areasQuery.isLoading}
        isError={areasQuery.isError}
        errorMessage={areasQuery.error?.message}
      >
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            {m.appointment_choose_expertise()}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(areasQuery.data ?? []).map((area) => {
              const active = area.id === areaId
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setAreaId(area.id)}
                  className={cn(
                    'ios-press rounded-2xl border px-4 py-4 text-start transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <span className="block text-sm font-semibold">{area.name}</span>
                  {area.name_en ? (
                    <span className="mt-1 block text-xs opacity-70">{area.name_en}</span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {areaId ? (
          <div className="space-y-6">
            <CtCard>
              <CtCardHeader>
                <CtCardTitle className="text-lg">{m.appointment_filters_title()}</CtCardTitle>
                <CtCardDescription>
                  {m.appointment_selected_expertise({
                    name: selectedArea?.name ?? '',
                  })}
                </CtCardDescription>
              </CtCardHeader>
              <CtCardContent className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <CtLabel>{m.appointment_filter_mentor()}</CtLabel>
                  <CtSelectRoot value={mentorId} onValueChange={setMentorId}>
                    <CtSelectTrigger className="w-full sm:max-w-sm">
                      <CtSelectValue placeholder={m.appointment_filter_mentor()} />
                    </CtSelectTrigger>
                    <CtSelectContent>
                      <CtSelectItem value="all">{m.appointment_all_mentors()}</CtSelectItem>
                      {(mentorsQuery.data ?? []).map((mentor) => (
                        <CtSelectItem key={mentor.id} value={String(mentor.id)}>
                          {mentor.name}
                        </CtSelectItem>
                      ))}
                    </CtSelectContent>
                  </CtSelectRoot>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">{m.appointment_timeline_hint()}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <CtButton
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canGoPrevWeek}
                      onClick={() => setWeekStart((current) => addDaysIso(current, -7))}
                    >
                      {m.appointment_prev_week()}
                    </CtButton>
                    <CtButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={weekStart === currentWeekStart}
                      onClick={() => setWeekStart(currentWeekStart)}
                    >
                      {m.appointment_this_week()}
                    </CtButton>
                    <CtButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setWeekStart((current) => addDaysIso(current, 7))}
                    >
                      {m.appointment_next_week()}
                    </CtButton>
                  </div>
                </div>
              </CtCardContent>
            </CtCard>

            <CtAsyncContent
              isLoading={slotsQuery.isLoading || mentorsQuery.isLoading}
              isError={slotsQuery.isError}
              errorMessage={
                slotsQuery.error ? getApiErrorMessage(slotsQuery.error) : undefined
              }
            >
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  {m.appointment_available_slots()}
                </h2>
                <CtAppointmentWeekTimeline
                  weekStart={weekStart}
                  slots={slotsQuery.data ?? []}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </div>
            </CtAsyncContent>

            {selectedSlot ? (
              <CtCard variant="inset">
                <CtCardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {m.appointment_mentor_label({ name: selectedSlot.mentor_name })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSlot.date} · {selectedSlot.start_time} – {selectedSlot.end_time}
                    </p>
                  </div>
                  <CtButton type="button" variant="ghost" size="sm" onClick={() => setSelectedSlot(null)}>
                    {m.user_cancel()}
                  </CtButton>
                </CtCardContent>
              </CtCard>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <CtButton asChild variant="secondary">
                <Link to="/appointments">{m.nav_my_appointments()}</Link>
              </CtButton>
              <CtButton
                type="button"
                disabled={!selectedSlot || bookMutation.isPending}
                onClick={() => {
                  if (!selectedSlot || !areaId) return
                  bookMutation.mutate({
                    area_of_expertise_id: areaId,
                    mentor_id: selectedSlot.mentor_id,
                    date: selectedSlot.date,
                    start_time: selectedSlot.start_time,
                  })
                }}
              >
                {bookMutation.isPending ? <CtSpinner className="size-4" /> : null}
                {m.appointment_confirm()}
              </CtButton>
            </div>
          </div>
        ) : null}
      </CtAsyncContent>
    </section>
  )
}
