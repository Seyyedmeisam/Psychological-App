import { useState } from 'react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import {
  CtAppointmentCardShell,
  CtAppointmentStatusBadge,
} from '@/modules/appointment/components/CtAppointmentCardParts'
import { CtAppointmentChatButton } from '@/modules/appointment/components/CtAppointmentChatButton'
import { CtAppointmentJoinMeeting } from '@/modules/appointment/components/CtAppointmentJoinMeeting'
import type { Appointment } from '@/modules/appointment/types'
import { cn } from '@/lib/utils'
import {
  appointmentStatusBadgeTone,
  appointmentStatusLabel,
} from '@/modules/appointment/utils/appointmentStatus'

function statusLabel(appointment: Appointment) {
  return appointmentStatusLabel(appointment)
}

function statusTone(appointment: Appointment) {
  return appointmentStatusBadgeTone(appointment)
}

export function CtAppointmentListCard({
  appointment,
  isMentor,
  isClient,
  isAdmin = false,
  cancelPending,
  ratePending,
  onCancel,
  onRate,
}: Readonly<{
  appointment: Appointment
  isMentor: boolean
  isClient: boolean
  isAdmin?: boolean
  cancelPending: boolean
  ratePending: boolean
  onCancel: (id: number) => void
  onRate: (appointmentId: number, score: number) => void
}>) {
  const [score, setScore] = useState(5)
  const cancelled =
    appointment.status === 'cancelled' ||
    appointment.status === 'user_absent' ||
    appointment.status === 'mentor_absent'
  const showMeeting = appointment.status === 'confirmed' && !appointment.is_completed
  const otherPerson = isMentor ? appointment.client : appointment.mentor
  const chatUserId = isAdmin
    ? undefined
    : isMentor
      ? appointment.client?.id
      : appointment.mentor?.id

  return (
    <CtAppointmentCardShell className={cn(cancelled && 'opacity-60')}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-foreground">
                {appointment.area_of_expertise?.name ?? '—'}
              </p>
              <CtAppointmentStatusBadge
                label={statusLabel(appointment)}
                tone={statusTone(appointment)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {appointment.date} · {appointment.start_time} – {appointment.end_time}
            </p>
          </div>

          {isMentor && appointment.client ? (
            <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {m.appointment_patient_section()}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {appointment.client.name}
              </p>
              {appointment.client.mobile ? (
                <a
                  href={`tel:${appointment.client.mobile.replace(/\s+/g, '')}`}
                  className="mt-1 inline-block text-sm text-muted-foreground hover:text-primary"
                  dir="ltr"
                >
                  {m.appointment_client_mobile({
                    mobile: appointment.client.mobile,
                  })}
                </a>
              ) : null}
            </div>
          ) : null}

          {!isMentor && !isClient ? (
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                {m.appointment_client_label({
                  name: appointment.client?.name ?? '—',
                })}
              </p>
              <p>
                {m.appointment_mentor_label({
                  name: appointment.mentor?.name ?? '—',
                })}
              </p>
            </div>
          ) : null}

          {isClient ? (
            <p className="text-sm text-muted-foreground">
              {m.appointment_mentor_label({
                name: otherPerson?.name ?? '—',
              })}
            </p>
          ) : null}

          {appointment.notes ? (
            <div className="rounded-xl border border-border/70 bg-background px-3 py-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {m.appointment_notes_label()}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {appointment.notes}
              </p>
            </div>
          ) : null}

          {!appointment.notes && isMentor ? (
            <p className="text-xs text-muted-foreground">
              {m.appointment_notes_empty()}
            </p>
          ) : null}

          {(isClient || isAdmin) && appointment.rating ? (
            <p className="text-xs text-muted-foreground">
              {isClient
                ? m.appointment_your_rating({
                    score: String(appointment.rating.score),
                  })
                : m.appointment_rating_label({
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
            {chatUserId ? <CtAppointmentChatButton userId={chatUserId} /> : null}

            {isClient && appointment.can_rate ? (
              <>
                <CtSelectRoot
                  value={String(score)}
                  onValueChange={(value) => setScore(Number(value))}
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
                  disabled={ratePending}
                  onClick={() => onRate(appointment.id, score)}
                >
                  {ratePending ? <CtSpinner className="size-4" /> : null}
                  {m.appointment_rate_submit()}
                </CtButton>
              </>
            ) : null}

            {!cancelled && !appointment.is_completed ? (
              <CtButton
                variant="destructive"
                size="sm"
                disabled={cancelPending}
                onClick={() => {
                  if (window.confirm(m.appointment_cancel_confirm())) {
                    onCancel(appointment.id)
                  }
                }}
              >
                {cancelPending ? <CtSpinner className="size-4" /> : null}
                {m.appointment_cancel()}
              </CtButton>
            ) : null}
          </div>
        </div>
      </div>
    </CtAppointmentCardShell>
  )
}
