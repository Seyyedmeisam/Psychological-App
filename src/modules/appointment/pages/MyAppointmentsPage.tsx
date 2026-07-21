import { useState } from 'react'
import { Link } from '@tanstack/react-router'
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
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import { useMe } from '@/modules/auth/hooks'
import {
  CtAppointmentCardShell,
  CtAppointmentStatusBadge,
} from '@/modules/appointment/components/CtAppointmentCardParts'
import { CtAppointmentJoinMeeting } from '@/modules/appointment/components/CtAppointmentJoinMeeting'
import {
  useCancelAppointment,
  useMyAppointments,
  useRateAppointment,
} from '@/modules/appointment/hooks'
import { cn } from '@/lib/utils'

function appointmentStatusLabel(appointment: {
  status: string
  is_completed?: boolean
}) {
  if (appointment.status === 'cancelled') return m.appointment_status_cancelled()
  if (appointment.is_completed) return m.appointment_status_completed()
  return m.appointment_status_confirmed()
}

function appointmentStatusTone(appointment: {
  status: string
  is_completed?: boolean
}): 'default' | 'success' | 'muted' | 'danger' {
  if (appointment.status === 'cancelled') return 'danger'
  if (appointment.is_completed) return 'success'
  return 'default'
}

export default function MyAppointmentsPage() {
  const { data: user } = useMe()
  const appointmentsQuery = useMyAppointments({
    refetchInterval: 60_000,
  })
  const cancelMutation = useCancelAppointment()
  const rateMutation = useRateAppointment()
  const isMentor = user?.role === 'mentor'
  const isClient = user?.role === 'user'
  const [ratingDraft, setRatingDraft] = useState<Record<number, number>>({})

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CtCardTitle className="text-2xl">{m.appointment_mine_title()}</CtCardTitle>
            <CtCardDescription>{m.appointment_mine_subtitle()}</CtCardDescription>
          </div>
          {user?.role === 'user' || user?.role === 'admin' ? (
            <CtButton asChild className="shrink-0">
              <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
            </CtButton>
          ) : null}
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={appointmentsQuery.isLoading}
        isError={appointmentsQuery.isError}
        errorMessage={appointmentsQuery.error?.message}
      >
        {(appointmentsQuery.data ?? []).length === 0 ? (
          <CtCard>
            <CtCardContent className="py-10 text-center text-sm text-muted-foreground">
              {m.appointment_empty()}
            </CtCardContent>
          </CtCard>
        ) : (
          <div className="grid gap-3">
            {(appointmentsQuery.data ?? []).map((appointment) => {
              const cancelled = appointment.status === 'cancelled'
              const otherPerson = isMentor
                ? appointment.client
                : appointment.mentor
              const score = ratingDraft[appointment.id] ?? 5
              const showMeeting =
                !cancelled && !appointment.is_completed

              return (
                <CtAppointmentCardShell
                  key={appointment.id}
                  className={cn(cancelled && 'opacity-60')}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-foreground">
                          {appointment.area_of_expertise?.name ?? '—'}
                        </p>
                        <CtAppointmentStatusBadge
                          label={appointmentStatusLabel(appointment)}
                          tone={appointmentStatusTone(appointment)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} · {appointment.start_time} –{' '}
                        {appointment.end_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isMentor
                          ? m.appointment_client_label({
                              name: otherPerson?.name ?? '—',
                            })
                          : m.appointment_mentor_label({
                              name: otherPerson?.name ?? '—',
                            })}
                      </p>
                      {appointment.rating ? (
                        <p className="text-xs text-muted-foreground">
                          {m.appointment_your_rating({
                            score: String(appointment.rating.score),
                          })}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      {showMeeting ? (
                        <CtAppointmentJoinMeeting appointment={appointment} />
                      ) : null}

                      <div className="flex flex-wrap items-center gap-2">
                        {isClient && appointment.can_rate ? (
                          <>
                            <CtSelectRoot
                              value={String(score)}
                              onValueChange={(value) =>
                                setRatingDraft((current) => ({
                                  ...current,
                                  [appointment.id]: Number(value),
                                }))
                              }
                            >
                              <CtSelectTrigger
                                className="h-9 w-20"
                                aria-label={m.appointment_rate_label()}
                              >
                                <CtSelectValue />
                              </CtSelectTrigger>
                              <CtSelectContent>
                                {[5, 4, 3, 2, 1].map((value) => (
                                  <CtSelectItem key={value} value={String(value)}>
                                    {value}/5
                                  </CtSelectItem>
                                ))}
                              </CtSelectContent>
                            </CtSelectRoot>
                            <CtButton
                              size="sm"
                              variant="secondary"
                              disabled={rateMutation.isPending}
                              onClick={() =>
                                rateMutation.mutate({
                                  appointmentId: appointment.id,
                                  score,
                                })
                              }
                            >
                              {rateMutation.isPending ? (
                                <CtSpinner className="size-4" />
                              ) : null}
                              {m.appointment_rate_submit()}
                            </CtButton>
                          </>
                        ) : null}

                        {!cancelled && !appointment.is_completed ? (
                          <CtButton
                            variant="ghost"
                            size="sm"
                            disabled={cancelMutation.isPending}
                            onClick={() => cancelMutation.mutate(appointment.id)}
                          >
                            {cancelMutation.isPending ? (
                              <CtSpinner className="size-4" />
                            ) : null}
                            {m.appointment_cancel()}
                          </CtButton>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CtAppointmentCardShell>
              )
            })}
          </div>
        )}
      </CtAsyncContent>
    </section>
  )
}
