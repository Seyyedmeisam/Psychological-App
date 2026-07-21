export type AppointmentMeetingFields = {
  meeting_url?: string | null
  is_in_session?: boolean
  can_join_meeting?: boolean
}

const JOIN_EARLY_MS = 15 * 60 * 1000

export function parseAppointmentDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

export function isAppointmentInSessionWindow(
  appointment: AppointmentMeetingFields & {
    date: string
    start_time: string
    end_time: string
    status: string
  },
  now = new Date(),
): boolean {
  if (appointment.status !== 'confirmed') {
    return false
  }

  const start = parseAppointmentDateTime(appointment.date, appointment.start_time)
  const end = parseAppointmentDateTime(appointment.date, appointment.end_time)

  return now >= start && now <= end
}

/** Prefer local clock so the join button updates without waiting for refetch. */
export function canJoinAppointmentMeeting(
  appointment: AppointmentMeetingFields & {
    date: string
    start_time: string
    end_time: string
    status: string
  },
  now = new Date(),
): boolean {
  if (appointment.status !== 'confirmed') {
    return false
  }

  const start = parseAppointmentDateTime(appointment.date, appointment.start_time)
  const end = parseAppointmentDateTime(appointment.date, appointment.end_time)
  const joinFrom = new Date(start.getTime() - JOIN_EARLY_MS)

  return now >= joinFrom && now <= end
}

export function minutesUntilJoinOpens(
  appointment: {
    date: string
    start_time: string
    status: string
  },
  now = new Date(),
): number | null {
  if (appointment.status !== 'confirmed') return null
  const start = parseAppointmentDateTime(appointment.date, appointment.start_time)
  const joinFrom = new Date(start.getTime() - JOIN_EARLY_MS)
  if (now >= joinFrom) return 0
  return Math.ceil((joinFrom.getTime() - now.getTime()) / 60_000)
}
