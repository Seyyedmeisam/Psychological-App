import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2,
  CalendarPlus,
  MessageCircle,
  User,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import {
  CtAppointmentCardShell,
  CtAppointmentStatusBadge,
} from '@/modules/appointment/components/CtAppointmentCardParts'
import { CtAppointmentChatButton } from '@/modules/appointment/components/CtAppointmentChatButton'
import { CtAppointmentJoinMeeting } from '@/modules/appointment/components/CtAppointmentJoinMeeting'
import { useMyAppointments } from '@/modules/appointment/hooks'
import type { Appointment } from '@/modules/appointment/types'
import { parseAppointmentDateTime } from '@/modules/appointment/utils/appointmentSession'
import { useMe } from '@/modules/auth/hooks'
import { cn } from '@/lib/utils'

function isUpcomingAppointment(appointment: Appointment, now = new Date()) {
  if (appointment.status !== 'confirmed') return false
  if (appointment.is_completed) return false
  const end = parseAppointmentDateTime(appointment.date, appointment.end_time)
  return end.getTime() >= now.getTime()
}

function compareAppointmentsAsc(a: Appointment, b: Appointment) {
  const left = `${a.date}T${a.start_time}`
  const right = `${b.date}T${b.start_time}`
  return left.localeCompare(right)
}

function StatCard({
  label,
  value,
}: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-ios-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  )
}

function QuickLinkCard({
  to,
  title,
  description,
  icon: Icon,
  primary,
}: Readonly<{
  to: '/appointments/book' | '/appointments' | '/chats' | '/profile'
  title: string
  description: string
  icon: typeof CalendarPlus
  primary?: boolean
}>) {
  return (
    <Link
      to={to}
      className={cn(
        'ios-press group flex flex-col gap-3 rounded-2xl border p-4 transition-colors',
        primary
          ? 'border-primary/40 bg-primary/10 text-foreground hover:bg-primary/15'
          : 'border-border bg-card text-foreground hover:bg-muted/40',
      )}
    >
      <span
        className={cn(
          'inline-flex size-11 items-center justify-center rounded-xl',
          primary
            ? 'bg-primary text-primary-foreground'
            : 'bg-accent text-accent-foreground',
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
      </span>
    </Link>
  )
}

export default function ClientHomePage() {
  const { data: user } = useMe()
  const appointmentsQuery = useMyAppointments({
    refetchInterval: 60_000,
  })

  const { upcoming, completedCount, cancelledCount } = useMemo(() => {
    const all = appointmentsQuery.data ?? []
    const now = new Date()
    const next = all
      .filter((appointment) => isUpcomingAppointment(appointment, now))
      .sort(compareAppointmentsAsc)

    return {
      upcoming: next,
      completedCount: all.filter((appointment) => appointment.is_completed).length,
      cancelledCount: all.filter(
        (appointment) =>
          appointment.status === 'cancelled' ||
          appointment.status === 'user_absent' ||
          appointment.status === 'mentor_absent',
      ).length,
    }
  }, [appointmentsQuery.data])

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        className="mb-8"
        title={m.client_home_title()}
        description={m.client_home_welcome({ name: user?.name ?? '' })}
        action={
          <CtButton asChild>
            <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
          </CtButton>
        }
      />

      <CtAsyncContent
        isLoading={appointmentsQuery.isLoading}
        isError={appointmentsQuery.isError}
        errorMessage={appointmentsQuery.error?.message}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={m.client_home_stat_upcoming()}
            value={upcoming.length}
          />
          <StatCard
            label={m.client_home_stat_completed()}
            value={completedCount}
          />
          <StatCard
            label={m.client_home_stat_cancelled()}
            value={cancelledCount}
          />
        </div>

        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            {m.client_home_actions()}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLinkCard
              to="/appointments/book"
              title={m.nav_book_appointment()}
              description={m.client_home_quick_book_desc()}
              icon={CalendarPlus}
              primary
            />
            <QuickLinkCard
              to="/appointments"
              title={m.nav_my_appointments()}
              description={m.client_home_quick_appointments_desc()}
              icon={CalendarCheck2}
            />
            <QuickLinkCard
              to="/chats"
              title={m.nav_chats()}
              description={m.client_home_quick_chats_desc()}
              icon={MessageCircle}
            />
            <QuickLinkCard
              to="/profile"
              title={m.nav_profile()}
              description={m.client_home_quick_profile_desc()}
              icon={User}
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              {m.client_home_upcoming_title()}
            </h2>
            <CtButton asChild variant="secondary" size="sm">
              <Link to="/appointments">{m.client_home_view_all()}</Link>
            </CtButton>
          </div>

          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {m.client_home_upcoming_empty()}
              </p>
              <CtButton asChild className="mt-4">
                <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
              </CtButton>
            </div>
          ) : (
            <div className="grid gap-3">
              {upcoming.slice(0, 5).map((appointment) => (
                <CtAppointmentCardShell key={appointment.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {appointment.area_of_expertise?.name ?? '—'}
                        </p>
                        <CtAppointmentStatusBadge
                          label={m.appointment_status_confirmed()}
                          tone="default"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {appointment.date} · {appointment.start_time} –{' '}
                        {appointment.end_time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.appointment_mentor_label({
                          name: appointment.mentor?.name ?? '—',
                        })}
                      </p>
                      {appointment.notes ? (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {m.appointment_notes_label()}:{' '}
                          </span>
                          {appointment.notes}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <CtAppointmentJoinMeeting appointment={appointment} />
                      {appointment.mentor?.id ? (
                        <CtAppointmentChatButton userId={appointment.mentor.id} />
                      ) : null}
                    </div>
                  </div>
                </CtAppointmentCardShell>
              ))}
            </div>
          )}
        </div>
      </CtAsyncContent>
    </section>
  )
}
