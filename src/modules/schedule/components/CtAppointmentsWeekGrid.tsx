import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { CtButton } from '@/modules/app/components/CtButton'
import type { Appointment } from '@/modules/appointment/types'
import {
  appointmentCalendarCellClass,
  appointmentLegendDotClass,
  appointmentStatusLabel,
  getAppointmentVisualKind,
  type AppointmentStatusValue,
  type AppointmentVisualKind,
} from '@/modules/appointment/utils/appointmentStatus'
import {
  addDaysIso,
  getWeekDates,
  getWeekStartIso,
  todayIso,
} from '@/modules/appointment/utils/weekTimeline'
import type { TemplateSlot } from '@/modules/schedule/types'

function formatDayHeader(date: string) {
  return new Intl.DateTimeFormat(getLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function appointmentKey(date: string, start: string) {
  return `${date}|${start}`
}

const LEGEND: AppointmentVisualKind[] = [
  'completed',
  'upcoming',
  'cancelled',
  'user_absent',
  'mentor_absent',
]

function legendLabel(kind: AppointmentVisualKind) {
  switch (kind) {
    case 'completed':
      return m.appointment_status_completed()
    case 'upcoming':
      return m.appointment_status_confirmed()
    case 'cancelled':
      return m.appointment_status_cancelled()
    case 'user_absent':
      return m.appointment_status_user_absent()
    case 'mentor_absent':
      return m.appointment_status_mentor_absent()
  }
}

type CtAppointmentsWeekGridProps = {
  templateSlots: TemplateSlot[]
  appointments: Appointment[]
  statusPendingId?: number | null
  onUpdateStatus?: (appointmentId: number, status: AppointmentStatusValue) => void
}

export function CtAppointmentsWeekGrid({
  templateSlots,
  appointments,
  statusPendingId = null,
  onUpdateStatus,
}: Readonly<CtAppointmentsWeekGridProps>) {
  const currentWeekStart = getWeekStartIso()
  const [weekStart, setWeekStart] = useState(currentWeekStart)
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart])
  const today = todayIso()

  const bySlot = useMemo(() => {
    const map = new Map<string, Appointment>()
    for (const appointment of appointments) {
      map.set(appointmentKey(appointment.date, appointment.start_time), appointment)
    }
    return map
  }, [appointments])

  const weekAppointments = useMemo(() => {
    const start = weekDates[0]
    const end = weekDates[6]
    return appointments.filter((a) => a.date >= start && a.date <= end)
  }, [appointments, weekDates])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CtButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setWeekStart((current) => addDaysIso(current, -7))}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
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
            variant="secondary"
            size="sm"
            onClick={() => setWeekStart((current) => addDaysIso(current, 7))}
          >
            {m.appointment_next_week()}
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </CtButton>
        </div>
        <p className="text-sm text-muted-foreground">
          {m.schedule_appointments_count({ count: String(weekAppointments.length) })}
        </p>
      </div>

      <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {LEGEND.map((kind) => (
          <li key={kind} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn('size-2.5 rounded-full', appointmentLegendDotClass(kind))}
            />
            {legendLabel(kind)}
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-ios-sm">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60">
              <th className="sticky inset-s-0 z-10 min-w-28 bg-secondary/60 px-3 py-3 text-start font-semibold text-muted-foreground">
                {m.schedule_time()}
              </th>
              {weekDates.map((date) => {
                const isToday = date === today
                return (
                  <th
                    key={date}
                    className={cn(
                      'min-w-28 px-2 py-3 text-center font-semibold',
                      isToday ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    <span className="block text-xs font-medium tracking-wide opacity-90">
                      {formatDayHeader(date)}
                    </span>
                    {isToday ? (
                      <span className="mt-0.5 block text-[0.65rem] font-semibold text-primary">
                        {m.appointment_today()}
                      </span>
                    ) : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {templateSlots.map((slot, rowIndex) => (
              <tr
                key={slot.start}
                className={cn(
                  'border-b border-border/70',
                  rowIndex % 2 === 0 ? 'bg-card' : 'bg-secondary/15',
                )}
              >
                <td className="sticky inset-s-0 z-10 bg-inherit px-3 py-2 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {slot.start} – {slot.end}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {m.schedule_session_meta()}
                    </span>
                  </div>
                </td>
                {weekDates.map((date) => {
                  const appointment = bySlot.get(appointmentKey(date, slot.start))
                  if (!appointment) {
                    return (
                      <td key={`${date}-${slot.start}`} className="px-1.5 py-1.5">
                        <div className="flex min-h-18 items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 text-[11px] text-muted-foreground/70">
                          —
                        </div>
                      </td>
                    )
                  }

                  const kind = getAppointmentVisualKind(appointment)
                  const canMarkAbsence =
                    Boolean(onUpdateStatus) &&
                    appointment.status === 'confirmed' &&
                    appointment.is_completed
                  const pending = statusPendingId === appointment.id

                  return (
                    <td key={`${date}-${slot.start}`} className="px-1.5 py-1.5 align-top">
                      <div
                        className={cn(
                          'flex min-h-18 flex-col justify-between gap-1 rounded-xl border px-2 py-1.5 text-start',
                          appointmentCalendarCellClass(kind),
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold leading-tight">
                            {appointment.client?.name ?? '—'}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] opacity-80">
                            {appointment.area_of_expertise?.name ??
                              appointmentStatusLabel(appointment)}
                          </p>
                        </div>
                        <p className="text-[10px] font-medium opacity-90">
                          {appointmentStatusLabel(appointment)}
                        </p>
                        {canMarkAbsence ? (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            <button
                              type="button"
                              disabled={pending}
                              className="rounded-md bg-background/55 px-1.5 py-0.5 text-[10px] font-medium hover:bg-background/80 disabled:opacity-50"
                              onClick={() => onUpdateStatus?.(appointment.id, 'user_absent')}
                            >
                              {m.schedule_mark_user_absent()}
                            </button>
                            <button
                              type="button"
                              disabled={pending}
                              className="rounded-md bg-background/55 px-1.5 py-0.5 text-[10px] font-medium hover:bg-background/80 disabled:opacity-50"
                              onClick={() => onUpdateStatus?.(appointment.id, 'mentor_absent')}
                            >
                              {m.schedule_mark_mentor_absent()}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
