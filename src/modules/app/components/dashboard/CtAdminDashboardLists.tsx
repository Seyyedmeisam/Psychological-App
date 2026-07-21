import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAvatar } from '@/modules/app/components/CtAvatar'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import {
  CtAppointmentStatusBadge,
} from '@/modules/appointment/components/CtAppointmentCardParts'
import type { AdminStats } from '@/modules/appointment/types'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      dateStyle: 'medium',
    }).format(new Date(`${iso}T12:00:00`))
  } catch {
    return iso
  }
}

function meetingTone(appointment: {
  status: string
  is_completed: boolean
}): 'default' | 'success' | 'muted' | 'danger' {
  if (appointment.status === 'cancelled') return 'danger'
  if (appointment.status === 'user_absent' || appointment.status === 'mentor_absent') {
    return 'muted'
  }
  if (appointment.is_completed) return 'success'
  return 'default'
}

function meetingLabel(appointment: {
  status: string
  is_completed: boolean
}) {
  if (appointment.status === 'cancelled') return m.appointment_status_cancelled()
  if (appointment.status === 'user_absent') return m.appointment_status_user_absent()
  if (appointment.status === 'mentor_absent') return m.appointment_status_mentor_absent()
  if (appointment.is_completed) return m.appointment_status_completed()
  return m.appointment_status_confirmed()
}

type Props = {
  stats: AdminStats
}

export function CtAdminDashboardLists({ stats }: Readonly<Props>) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CtCard variant="elevated">
        <CtCardHeader>
          <CtCardTitle>{m.dashboard_top_mentors_title()}</CtCardTitle>
          <CtCardDescription>{m.dashboard_top_mentors_hint()}</CtCardDescription>
        </CtCardHeader>
        <CtCardContent className="space-y-3">
          {stats.top_mentors.length === 0 ? (
            <p className="rounded-xl bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
              {m.dashboard_list_empty()}
            </p>
          ) : (
            stats.top_mentors.map((mentor, index) => (
              <div
                key={mentor.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
              >
                <span className="w-5 text-center text-xs font-semibold text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <CtAvatar name={mentor.name} seed={mentor.id} src={null} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {mentor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.dashboard_mentor_meetings({
                      count: String(mentor.meetings_count),
                    })}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                  <Star className="size-3.5 fill-current text-[oklch(0.75_0.15_75)]" aria-hidden />
                  {mentor.rating_average !== null ? mentor.rating_average : '—'}
                </div>
              </div>
            ))
          )}
          <Link
            to="/users"
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            {m.dashboard_view_all_users()}
          </Link>
        </CtCardContent>
      </CtCard>

      <CtCard variant="elevated">
        <CtCardHeader>
          <CtCardTitle>{m.dashboard_recent_title()}</CtCardTitle>
          <CtCardDescription>{m.dashboard_recent_hint()}</CtCardDescription>
        </CtCardHeader>
        <CtCardContent className="space-y-2">
          {stats.recent_appointments.length === 0 ? (
            <p className="rounded-xl bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
              {m.dashboard_list_empty()}
            </p>
          ) : (
            stats.recent_appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {appointment.client.name ?? '—'}
                      <span className="mx-1 font-normal text-muted-foreground">·</span>
                      {appointment.mentor.name ?? '—'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(appointment.date)} · {appointment.start_time}
                      {appointment.area_of_expertise
                        ? ` · ${appointment.area_of_expertise.name}`
                        : ''}
                    </p>
                  </div>
                  <CtAppointmentStatusBadge
                    tone={meetingTone(appointment)}
                    label={meetingLabel(appointment)}
                  />
                </div>
              </div>
            ))
          )}
          <Link
            to="/appointments"
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            {m.dashboard_view_all_appointments()}
          </Link>
        </CtCardContent>
      </CtCard>
    </div>
  )
}
