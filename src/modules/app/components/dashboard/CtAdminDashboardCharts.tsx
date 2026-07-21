import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import type { AdminStats } from '@/modules/appointment/types'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'oklch(0.58 0.22 252)',
  cancelled: 'oklch(0.58 0.22 25)',
  user_absent: 'oklch(0.75 0.15 75)',
  mentor_absent: 'oklch(0.55 0.08 300)',
}

const RATING_COLOR = 'oklch(0.62 0.17 145)'

function statusLabel(status: string) {
  switch (status) {
    case 'confirmed':
      return m.appointment_status_confirmed()
    case 'cancelled':
      return m.appointment_status_cancelled()
    case 'user_absent':
      return m.appointment_status_user_absent()
    case 'mentor_absent':
      return m.appointment_status_mentor_absent()
    default:
      return status
  }
}

function formatShortDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      month: 'short',
      day: 'numeric',
    }).format(new Date(`${iso}T12:00:00`))
  } catch {
    return iso.slice(5)
  }
}

type CtAdminDashboardChartsProps = {
  stats: AdminStats
}

export function CtAdminDashboardCharts({
  stats,
}: Readonly<CtAdminDashboardChartsProps>) {
  const trend = stats.appointments_trend.map((point) => ({
    ...point,
    label: formatShortDate(point.date),
  }))

  const statusData = stats.appointments_by_status
    .filter((row) => row.count > 0)
    .map((row) => ({
      ...row,
      name: statusLabel(row.status),
      fill: STATUS_COLORS[row.status] ?? 'oklch(0.55 0.01 286)',
    }))

  const ratingData = stats.rating_distribution.map((row) => ({
    ...row,
    label: String(row.score),
  }))

  const hasTrend = trend.some((p) => p.count > 0)
  const hasStatus = statusData.length > 0
  const hasRatings = ratingData.some((r) => r.count > 0)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CtCard variant="elevated" className="overflow-hidden">
        <CtCardHeader>
          <CtCardTitle>{m.dashboard_chart_trend_title()}</CtCardTitle>
          <CtCardDescription>{m.dashboard_chart_trend_hint()}</CtCardDescription>
        </CtCardHeader>
        <CtCardContent className="h-64 pe-2 ps-0">
          {hasTrend ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.22 252)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.58 0.22 252)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'oklch(0.55 0.01 286)' }}
                />
                <YAxis
                  allowDecimals={false}
                  width={32}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'oklch(0.55 0.01 286)' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid oklch(0.55 0.01 286 / 0.22)',
                    background: 'oklch(1 0 0)',
                    fontSize: 12,
                  }}
                  labelFormatter={(_, payload) =>
                    payload[0]?.payload?.date
                      ? formatShortDate(String(payload[0].payload.date))
                      : ''
                  }
                  formatter={(value) => [value ?? 0, m.dashboard_chart_appointments()]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="oklch(0.58 0.22 252)"
                  strokeWidth={2}
                  fill="url(#adminTrendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message={m.dashboard_chart_empty()} />
          )}
        </CtCardContent>
      </CtCard>

      <CtCard variant="elevated" className="overflow-hidden">
        <CtCardHeader>
          <CtCardTitle>{m.dashboard_chart_status_title()}</CtCardTitle>
          <CtCardDescription>{m.dashboard_chart_status_hint()}</CtCardDescription>
        </CtCardHeader>
        <CtCardContent className="h-64">
          {hasStatus ? (
            <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-h-0 min-w-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid oklch(0.55 0.01 286 / 0.22)',
                        background: 'oklch(1 0 0)',
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex shrink-0 flex-col gap-2 sm:w-40">
                {statusData.map((row) => (
                  <li key={row.status} className="flex items-center gap-2 text-sm">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: row.fill }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {row.name}
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {row.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyChart message={m.dashboard_chart_empty()} />
          )}
        </CtCardContent>
      </CtCard>

      <CtCard variant="elevated" className="overflow-hidden lg:col-span-2">
        <CtCardHeader>
          <CtCardTitle>{m.dashboard_chart_ratings_title()}</CtCardTitle>
          <CtCardDescription>{m.dashboard_chart_ratings_hint()}</CtCardDescription>
        </CtCardHeader>
        <CtCardContent className="h-56 pe-2 ps-0">
          {hasRatings ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: 'oklch(0.55 0.01 286)' }}
                />
                <YAxis
                  allowDecimals={false}
                  width={32}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'oklch(0.55 0.01 286)' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid oklch(0.55 0.01 286 / 0.22)',
                    background: 'oklch(1 0 0)',
                    fontSize: 12,
                  }}
                  formatter={(value) => [value ?? 0, m.dashboard_chart_reviews()]}
                  labelFormatter={(label) =>
                    m.dashboard_chart_rating_score({ score: String(label ?? '') })
                  }
                />
                <Bar dataKey="count" fill={RATING_COLOR} radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message={m.dashboard_chart_empty()} />
          )}
        </CtCardContent>
      </CtCard>
    </div>
  )
}

function EmptyChart({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-muted/40 px-4 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
