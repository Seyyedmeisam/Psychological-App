import { Video } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { useJoinMeeting } from '@/modules/appointment/hooks'
import {
  canJoinAppointmentMeeting,
  minutesUntilJoinOpens,
} from '@/modules/appointment/utils/appointmentSession'
import { useEffect, useState } from 'react'

type JoinableAppointment = {
  id: number
  date: string
  start_time: string
  end_time: string
  status: string
  can_join_meeting?: boolean
  is_in_session?: boolean
}

export function CtAppointmentJoinMeeting({
  appointment,
}: Readonly<{ appointment: JoinableAppointment }>) {
  const joinMutation = useJoinMeeting()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  const canJoin = canJoinAppointmentMeeting(appointment, now)
  const minutesLeft = minutesUntilJoinOpens(appointment, now)
  const cancelled =
    appointment.status === 'cancelled' ||
    appointment.status === 'user_absent' ||
    appointment.status === 'mentor_absent'

  if (cancelled) {
    return null
  }

  const label = canJoin
    ? m.appointment_join_meeting()
    : minutesLeft !== null && minutesLeft > 0 && minutesLeft <= 120
      ? m.appointment_join_in_minutes({ minutes: String(minutesLeft) })
      : m.appointment_join_meeting_soon()

  return (
    <CtButton
      size="sm"
      className="inline-flex items-center"
      disabled={!canJoin || joinMutation.isPending}
      onClick={() =>
        joinMutation.mutate(appointment.id, {
          onSuccess: (data) => {
            window.open(data.meeting_url, '_blank', 'noopener,noreferrer')
          },
        })
      }
    >
      {joinMutation.isPending ? (
        <CtSpinner className="me-2 size-4" />
      ) : (
        <Video className="me-2 size-4" aria-hidden />
      )}
      {label}
    </CtButton>
  )
}
