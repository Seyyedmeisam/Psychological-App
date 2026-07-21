import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { useAdminStats } from '@/modules/appointment/hooks'
import { useMe } from '@/modules/auth/hooks'

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

export default function AdminDashboardPage() {
  const { data: user } = useMe()
  const statsQuery = useAdminStats()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-8">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.dashboard_title()}</CtCardTitle>
          <CtCardDescription>
            {m.dashboard_welcome({ name: user?.name ?? '' })}
          </CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtAsyncContent
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
        errorMessage={statsQuery.error?.message}
      >
        {statsQuery.data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={m.dashboard_stat_clients_booked()}
              value={statsQuery.data.clients_booked}
            />
            <StatCard
              label={m.dashboard_stat_meetings_confirmed()}
              value={statsQuery.data.meetings_confirmed}
            />
            <StatCard
              label={m.dashboard_stat_meetings_cancelled()}
              value={statsQuery.data.meetings_cancelled}
            />
            <StatCard
              label={m.dashboard_stat_rating_average()}
              value={
                statsQuery.data.rating_average !== null
                  ? `${statsQuery.data.rating_average} / 5`
                  : '—'
              }
            />
            <StatCard
              label={m.dashboard_stat_meetings_upcoming()}
              value={statsQuery.data.meetings_upcoming}
            />
            <StatCard
              label={m.dashboard_stat_meetings_completed()}
              value={statsQuery.data.meetings_completed}
            />
            <StatCard
              label={m.dashboard_stat_clients_total()}
              value={statsQuery.data.clients_total}
            />
            <StatCard
              label={m.dashboard_stat_mentors_total()}
              value={statsQuery.data.mentors_total}
            />
          </div>
        ) : null}
      </CtAsyncContent>

      <div className="mt-8 flex flex-wrap gap-3">
        <CtButton asChild>
          <Link to="/users">{m.nav_users()}</Link>
        </CtButton>
        <CtButton asChild variant="secondary">
          <Link to="/appointments">{m.nav_my_appointments()}</Link>
        </CtButton>
      </div>
    </section>
  )
}
