import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2,
  CalendarClock,
  CalendarX2,
  MessageSquare,
  MessagesSquare,
  Star,
  UserRound,
  Users,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { CtAdminDashboardCharts } from '@/modules/app/components/dashboard/CtAdminDashboardCharts'
import { CtAdminDashboardLists } from '@/modules/app/components/dashboard/CtAdminDashboardLists'
import { CtAdminKpiCard } from '@/modules/app/components/dashboard/CtAdminKpiCard'
import { CtAdminTodayAppointments } from '@/modules/app/components/dashboard/CtAdminTodayAppointments'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import {
  useAdminStats,
  useMyAppointments,
  useUpdateAppointmentStatus,
} from '@/modules/appointment/hooks'
import type { AppointmentStatusValue } from '@/modules/appointment/types'
import { todayIso } from '@/modules/appointment/utils/weekTimeline'
import { useMe } from '@/modules/auth/hooks'
import { CtAppointmentsWeekGrid } from '@/modules/schedule/components/CtAppointmentsWeekGrid'
import { useAvailabilityTemplate } from '@/modules/schedule/hooks'

type DashboardTab = 'overview' | 'today' | 'week'

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<DashboardTab>('overview')
  const { data: user } = useMe()
  const statsQuery = useAdminStats()
  const appointmentsQuery = useMyAppointments({ refetchInterval: 60_000 })
  const templateQuery = useAvailabilityTemplate()
  const statusMutation = useUpdateAppointmentStatus()

  const today = todayIso()
  const todayAppointments = useMemo(
    () => (appointmentsQuery.data ?? []).filter((item) => item.date === today),
    [appointmentsQuery.data, today],
  )

  const templateSlots = templateQuery.data?.slots ?? []

  const scheduleLoading =
    appointmentsQuery.isLoading || (tab === 'week' && templateQuery.isLoading)
  const scheduleError =
    appointmentsQuery.isError || (tab === 'week' && templateQuery.isError)
  const scheduleErrorMessage =
    appointmentsQuery.error?.message ?? templateQuery.error?.message

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        title={m.dashboard_title()}
        description={m.dashboard_welcome({ name: user?.name ?? '' })}
        className="mb-6"
        action={
          <div className="flex flex-wrap gap-2">
            <CtButton asChild size="sm">
              <Link to="/users">{m.nav_users()}</Link>
            </CtButton>
            <CtButton asChild variant="secondary" size="sm">
              <Link to="/appointments">{m.nav_my_appointments()}</Link>
            </CtButton>
            <CtButton asChild variant="secondary" size="sm">
              <Link to="/chats">{m.nav_chats()}</Link>
            </CtButton>
          </div>
        }
      />

      <div
        className="mb-6 inline-flex flex-wrap rounded-2xl border border-border bg-card p-1 shadow-ios-sm"
        role="tablist"
        aria-label={m.dashboard_title()}
      >
        {(
          [
            ['overview', m.dashboard_tab_overview()],
            ['today', m.dashboard_tab_today()],
            ['week', m.dashboard_tab_week()],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
              tab === id
                ? 'bg-primary text-primary-foreground shadow-ios-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => setTab(id)}
          >
            {label}
            {id === 'today' ? (
              <span className="ms-1.5 tabular-nums opacity-80">
                ({todayAppointments.length})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <CtAsyncContent
          isLoading={statsQuery.isLoading}
          isError={statsQuery.isError}
          errorMessage={statsQuery.error?.message}
        >
          {statsQuery.data ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CtAdminKpiCard
                  label={m.dashboard_stat_clients_total()}
                  value={statsQuery.data.clients_total}
                  hint={m.dashboard_stat_clients_booked_hint({
                    count: String(statsQuery.data.clients_booked),
                  })}
                  icon={UserRound}
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_mentors_total()}
                  value={statsQuery.data.mentors_total}
                  hint={m.dashboard_stat_users_total_hint({
                    count: String(statsQuery.data.users_total),
                  })}
                  icon={Users}
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_meetings_upcoming()}
                  value={statsQuery.data.meetings_upcoming}
                  hint={m.dashboard_stat_appointments_total_hint({
                    count: String(statsQuery.data.appointments_total),
                  })}
                  icon={CalendarClock}
                  tone="success"
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_rating_average()}
                  value={
                    statsQuery.data.rating_average !== null
                      ? `${statsQuery.data.rating_average} / 5`
                      : '—'
                  }
                  hint={m.dashboard_stat_rating_count_hint({
                    count: String(statsQuery.data.rating_count),
                  })}
                  icon={Star}
                  tone="warning"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CtAdminKpiCard
                  label={m.dashboard_stat_meetings_completed()}
                  value={statsQuery.data.meetings_completed}
                  icon={CalendarCheck2}
                  tone="success"
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_meetings_cancelled()}
                  value={statsQuery.data.meetings_cancelled}
                  icon={CalendarX2}
                  tone="danger"
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_conversations()}
                  value={statsQuery.data.conversations_total}
                  hint={m.dashboard_stat_messages_today_hint({
                    count: String(statsQuery.data.messages_today),
                  })}
                  icon={MessagesSquare}
                />
                <CtAdminKpiCard
                  label={m.dashboard_stat_messages_total()}
                  value={statsQuery.data.messages_total}
                  icon={MessageSquare}
                />
              </div>

              <CtAdminDashboardCharts stats={statsQuery.data} />
              <CtAdminDashboardLists stats={statsQuery.data} />
            </div>
          ) : null}
        </CtAsyncContent>
      ) : null}

      {tab === 'today' ? (
        <CtAsyncContent
          isLoading={scheduleLoading}
          isError={scheduleError}
          errorMessage={scheduleErrorMessage}
        >
          <CtAdminTodayAppointments
            dateIso={today}
            appointments={todayAppointments}
          />
        </CtAsyncContent>
      ) : null}

      {tab === 'week' ? (
        <CtAsyncContent
          isLoading={scheduleLoading}
          isError={scheduleError}
          errorMessage={scheduleErrorMessage}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {m.dashboard_week_hint()}
            </p>
            <CtAppointmentsWeekGrid
              templateSlots={templateSlots}
              appointments={appointmentsQuery.data ?? []}
              showMentor
              statusPendingId={
                statusMutation.isPending
                  ? statusMutation.variables.appointmentId
                  : null
              }
              onUpdateStatus={(appointmentId, status: AppointmentStatusValue) => {
                statusMutation.mutate({ appointmentId, status })
              }}
            />
          </div>
        </CtAsyncContent>
      ) : null}
    </section>
  )
}
