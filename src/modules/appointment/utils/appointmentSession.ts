export type AppointmentMeetingFields = {
  meeting_url?: string | null
  is_in_session?: boolean
  can_join_meeting?: boolean
}

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
  if (appointment.is_in_session !== undefined) {
    return Boolean(appointment.is_in_session)
  }

  if (appointment.status !== 'confirmed') {
    return false
  }

  const start = parseAppointmentDateTime(appointment.date, appointment.start_time)
  const end = parseAppointmentDateTime(appointment.date, appointment.end_time)

  return now >= start && now <= end
}

export function canJoinAppointmentMeeting(
  appointment: AppointmentMeetingFields & {
    date: string
    start_time: string
    end_time: string
    status: string
  },
  now = new Date(),
): boolean {
  if (appointment.can_join_meeting !== undefined) {
    return Boolean(appointment.can_join_meeting)
  }

  return isAppointmentInSessionWindow(appointment, now)
}
