import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtAppointmentStatusBadge } from '@/modules/appointment/components/CtAppointmentCardParts'
import type { Appointment } from '@/modules/appointment/types'
import {
  appointmentStatusLabel,
  getAppointmentVisualKind,
} from '@/modules/appointment/utils/appointmentStatus'

function toneFromKind(
  kind: ReturnType<typeof getAppointmentVisualKind>,
): 'default' | 'success' | 'muted' | 'danger' | 'warning' {
  switch (kind) {
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    case 'user_absent':
    case 'mentor_absent':
      return 'warning'
    default:
      return 'default'
  }
}

function formatClock(time: string) {
  return time.slice(0, 5)
}

function formatTodayHeading(iso: string) {
  return new Intl.DateTimeFormat(getLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${iso}T12:00:00`))
}

type CtAdminTodayAppointmentsProps = {
  dateIso: string
  appointments: Appointment[]
}

export function CtAdminTodayAppointments({
  dateIso,
  appointments,
}: Readonly<CtAdminTodayAppointmentsProps>) {
  const sorted = [...appointments].sort((a, b) =>
    a.start_time.localeCompare(b.start_time),
  )

  return (
    <CtCard variant="elevated">
      <CtCardHeader>
        <CtCardTitle>{m.dashboard_tab_today()}</CtCardTitle>
        <CtCardDescription>
          {formatTodayHeading(dateIso)} ·{' '}
          {m.dashboard_today_count({ count: String(sorted.length) })}
        </CtCardDescription>
      </CtCardHeader>
      <CtCardContent className="space-y-2">
        {sorted.length === 0 ? (
          <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
            {m.dashboard_today_empty()}
          </p>
        ) : (
          sorted.map((appointment) => {
            const kind = getAppointmentVisualKind(appointment)
            return (
              <div
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    <span className="tabular-nums">
                      {formatClock(appointment.start_time)}–
                      {formatClock(appointment.end_time)}
                    </span>
                    <span className="mx-1.5 font-normal text-muted-foreground">·</span>
                    {appointment.client?.name ?? '—'}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {appointment.mentor?.name ?? '—'}
                    {appointment.area_of_expertise
                      ? ` · ${appointment.area_of_expertise.name}`
                      : ''}
                  </p>
                </div>
                <CtAppointmentStatusBadge
                  tone={toneFromKind(kind)}
                  label={appointmentStatusLabel(appointment)}
                />
              </div>
            )
          })
        )}
      </CtCardContent>
    </CtCard>
  )
}
