import { m } from '@/core/i18n/paraglide/messages.js'
import type { Appointment } from '@/modules/appointment/types'

export type AppointmentStatusValue =
  | 'confirmed'
  | 'cancelled'
  | 'user_absent'
  | 'mentor_absent'

/** Visual kind used by calendar cells and legends. */
export type AppointmentVisualKind =
  | 'completed'
  | 'upcoming'
  | 'cancelled'
  | 'user_absent'
  | 'mentor_absent'

export function getAppointmentVisualKind(
  appointment: Pick<Appointment, 'status' | 'is_completed'>,
): AppointmentVisualKind {
  if (appointment.status === 'cancelled') return 'cancelled'
  if (appointment.status === 'user_absent') return 'user_absent'
  if (appointment.status === 'mentor_absent') return 'mentor_absent'
  if (appointment.is_completed) return 'completed'
  return 'upcoming'
}

export function appointmentStatusLabel(
  appointment: Pick<Appointment, 'status' | 'is_completed'>,
): string {
  switch (getAppointmentVisualKind(appointment)) {
    case 'cancelled':
      return m.appointment_status_cancelled()
    case 'user_absent':
      return m.appointment_status_user_absent()
    case 'mentor_absent':
      return m.appointment_status_mentor_absent()
    case 'completed':
      return m.appointment_status_completed()
    default:
      return m.appointment_status_confirmed()
  }
}

/** Tailwind classes for calendar cells — distinct colors, not all primary blue. */
export function appointmentCalendarCellClass(kind: AppointmentVisualKind): string {
  switch (kind) {
    case 'completed':
      return 'border-emerald-500/40 bg-emerald-500/20 text-emerald-900 dark:text-emerald-100'
    case 'upcoming':
      return 'border-sky-500/40 bg-sky-500/20 text-sky-950 dark:text-sky-100'
    case 'cancelled':
      return 'border-amber-400/50 bg-amber-300/30 text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100'
    case 'user_absent':
      return 'border-pink-400/50 bg-pink-400/25 text-pink-950 dark:text-pink-100'
    case 'mentor_absent':
      return 'border-red-500/45 bg-red-500/20 text-red-950 dark:text-red-100'
  }
}

export function appointmentLegendDotClass(kind: AppointmentVisualKind): string {
  switch (kind) {
    case 'completed':
      return 'bg-emerald-500'
    case 'upcoming':
      return 'bg-sky-500'
    case 'cancelled':
      return 'bg-amber-400'
    case 'user_absent':
      return 'bg-pink-400'
    case 'mentor_absent':
      return 'bg-red-500'
  }
}

export function appointmentStatusBadgeTone(
  appointment: Pick<Appointment, 'status' | 'is_completed'>,
): 'default' | 'success' | 'muted' | 'danger' | 'warning' | 'info' | 'pink' {
  switch (getAppointmentVisualKind(appointment)) {
    case 'completed':
      return 'success'
    case 'upcoming':
      return 'info'
    case 'cancelled':
      return 'warning'
    case 'user_absent':
      return 'pink'
    case 'mentor_absent':
      return 'danger'
  }
}
