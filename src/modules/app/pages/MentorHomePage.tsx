import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
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
import { CtMentorVerificationCard } from '@/modules/appointment/components/CtMentorVerificationCard'
import { useMentorProfile, useMyMentorVerification } from '@/modules/appointment/hooks'
import { useMe } from '@/modules/auth/hooks'
import { isApprovedMentor } from '@/modules/auth/utils/routeGuards'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = [
  () => m.weekday_mon(),
  () => m.weekday_tue(),
  () => m.weekday_wed(),
  () => m.weekday_thu(),
  () => m.weekday_fri(),
  () => m.weekday_sat(),
  () => m.weekday_sun(),
] as const

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

function meetingStatusLabel(meeting: {
  status: string
  is_completed: boolean
}) {
  if (meeting.status === 'cancelled') return m.appointment_status_cancelled()
  if (meeting.is_completed) return m.appointment_status_completed()
  return m.appointment_status_confirmed()
}

function meetingStatusTone(meeting: {
  status: string
  is_completed: boolean
}): 'default' | 'success' | 'muted' | 'danger' {
  if (meeting.status === 'cancelled') return 'danger'
  if (meeting.is_completed) return 'success'
  return 'default'
}

export default function MentorHomePage() {
  const { data: me } = useMe()
  const profileQuery = useMentorProfile({ refetchInterval: 60_000 })
  const verificationQuery = useMyMentorVerification()
  const [expertiseFilter, setExpertiseFilter] = useState<'all' | number>('all')
  const approved = isApprovedMentor(me)
  const hasEvidence = (verificationQuery.data?.evidences.length ?? 0) > 0

  const filteredMeetings = useMemo(() => {
    const meetings = profileQuery.data?.recent_meetings ?? []
    if (expertiseFilter === 'all') return meetings
    return meetings.filter(
      (meeting) => meeting.area_of_expertise?.id === expertiseFilter,
    )
  }, [expertiseFilter, profileQuery.data?.recent_meetings])

  const filteredAvailability = useMemo(() => {
    return profileQuery.data?.availability ?? []
  }, [profileQuery.data?.availability])

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtAsyncContent
        isLoading={profileQuery.isLoading}
        isError={profileQuery.isError}
        errorMessage={profileQuery.error?.message}
      >
        {profileQuery.data ? (
          <>
            <CtPageIntro
              className="mb-8"
              title={m.mentor_profile_title()}
              description={m.mentor_home_welcome({
                name: profileQuery.data.mentor.name,
              })}
              action={
                <div className="flex flex-wrap gap-2">
                  <CtButton asChild variant="secondary" size="sm">
                    <Link to="/appointments">{m.nav_my_appointments()}</Link>
                  </CtButton>
                  {approved ? (
                    <CtButton asChild variant="secondary" size="sm">
                      <Link to="/schedule">{m.nav_schedule()}</Link>
                    </CtButton>
                  ) : null}
                  <CtButton asChild variant="secondary" size="sm">
                    <Link to="/appointments/expertise">{m.nav_expertise()}</Link>
                  </CtButton>
                  <CtButton asChild variant="secondary" size="sm">
                    <Link to="/chats">{m.nav_chats()}</Link>
                  </CtButton>
                </div>
              }
            />

            <CtMentorVerificationCard />

            {(!profileQuery.data.expertise.length ||
              !approved ||
              !hasEvidence ||
              (approved && !profileQuery.data.availability.length)) && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                  {m.mentor_setup_title()}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {m.mentor_setup_hint()}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {hasEvidence
                        ? m.mentor_setup_verification_done()
                        : m.mentor_setup_verification_todo()}
                    </span>
                  </li>
                  <li className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {profileQuery.data.expertise.length
                        ? m.mentor_setup_expertise_done()
                        : m.mentor_setup_expertise_todo()}
                    </span>
                    {!profileQuery.data.expertise.length ? (
                      <CtButton asChild size="sm" variant="secondary">
                        <Link to="/appointments/expertise">{m.nav_expertise()}</Link>
                      </CtButton>
                    ) : null}
                  </li>
                  <li className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {!approved
                        ? m.mentor_setup_schedule_locked()
                        : profileQuery.data.availability.length
                          ? m.mentor_setup_schedule_done()
                          : m.mentor_setup_schedule_todo()}
                    </span>
                    {approved && !profileQuery.data.availability.length ? (
                      <CtButton asChild size="sm" variant="secondary">
                        <Link to="/schedule">{m.nav_schedule()}</Link>
                      </CtButton>
                    ) : null}
                  </li>
                </ul>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label={m.mentor_stat_meetings_done()}
                value={profileQuery.data.stats.meetings_done}
              />
              <StatCard
                label={m.mentor_stat_meetings_upcoming()}
                value={profileQuery.data.stats.meetings_upcoming}
              />
              <StatCard
                label={m.mentor_stat_meetings_cancelled()}
                value={profileQuery.data.stats.meetings_cancelled}
              />
            </div>

            <div className="mt-10">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                {m.mentor_expertise_breakdown()}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExpertiseFilter('all')}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                    expertiseFilter === 'all'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
                  )}
                >
                  {m.mentor_filter_all_expertise()}
                </button>
                {profileQuery.data.expertise.map((area) => {
                  const count =
                    profileQuery.data.meetings_by_expertise.find(
                      (item) => item.area_of_expertise_id === area.id,
                    )?.meetings_done ?? 0
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setExpertiseFilter(area.id)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                        expertiseFilter === area.id
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
                      )}
                    >
                      {area.name}
                      <span className="ms-2 text-xs opacity-70">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  {m.mentor_recent_meetings()}
                </h2>
                {filteredMeetings.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    {m.appointment_empty()}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredMeetings.map((meeting) => (
                      <CtAppointmentCardShell key={meeting.id}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {meeting.area_of_expertise?.name ?? '—'}
                              </p>
                              <CtAppointmentStatusBadge
                                label={meetingStatusLabel(meeting)}
                                tone={meetingStatusTone(meeting)}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {meeting.date} · {meeting.start_time} – {meeting.end_time}
                            </p>
                            <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2">
                              <p className="text-xs font-medium text-foreground">
                                {m.appointment_client_label({
                                  name: meeting.client?.name ?? '—',
                                })}
                              </p>
                              {meeting.client?.mobile ? (
                                <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
                                  {meeting.client.mobile}
                                </p>
                              ) : null}
                            </div>
                            {meeting.notes ? (
                              <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                  {m.appointment_notes_label()}:{' '}
                                </span>
                                {meeting.notes}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-2 sm:items-end">
                            {meeting.status === 'confirmed' && !meeting.is_completed ? (
                              <CtAppointmentJoinMeeting appointment={meeting} />
                            ) : null}
                            {meeting.client?.id ? (
                              <CtAppointmentChatButton userId={meeting.client.id} />
                            ) : null}
                          </div>
                        </div>
                      </CtAppointmentCardShell>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  {m.mentor_weekly_schedule()}
                </h2>
                {filteredAvailability.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    {m.mentor_schedule_empty()}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredAvailability.map((slot) => (
                      <div
                        key={`${slot.day_of_week}-${slot.start_time}`}
                        className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-foreground">
                          {WEEKDAY_LABELS[slot.day_of_week]?.() ?? slot.day_of_week}
                        </span>
                        <span className="text-muted-foreground">
                          {slot.start_time} – {slot.end_time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </CtAsyncContent>
    </section>
  )
}
