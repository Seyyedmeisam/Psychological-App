import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { useMe } from '@/modules/auth/hooks'
import {
  useCancelAppointment,
  useMyAppointments,
} from '@/modules/appointment/hooks'
import { cn } from '@/lib/utils'

export default function MyAppointmentsPage() {
  const { data: user } = useMe()
  const appointmentsQuery = useMyAppointments()
  const cancelMutation = useCancelAppointment()
  const isMentor = user?.role === 'mentor'

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.appointment_mine_title()}</CtCardTitle>
          <CtCardDescription>{m.appointment_mine_subtitle()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <div className="mb-4 flex justify-end">
        {user?.role === 'user' || user?.role === 'admin' ? (
          <CtButton asChild>
            <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
          </CtButton>
        ) : null}
      </div>

      <CtAsyncContent
        isLoading={appointmentsQuery.isLoading}
        isError={appointmentsQuery.isError}
        errorMessage={appointmentsQuery.error?.message}
      >
        {(appointmentsQuery.data ?? []).length === 0 ? (
          <CtCard>
            <CtCardContent className="py-10 text-center text-sm text-muted-foreground">
              {m.appointment_empty()}
            </CtCardContent>
          </CtCard>
        ) : (
          <div className="grid gap-3">
            {(appointmentsQuery.data ?? []).map((appointment) => {
              const cancelled = appointment.status === 'cancelled'
              const otherPerson = isMentor
                ? appointment.client
                : appointment.mentor

              return (
                <CtCard
                  key={appointment.id}
                  className={cn(cancelled && 'opacity-60')}
                >
                  <CtCardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {appointment.area_of_expertise?.name ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.date} · {appointment.start_time} –{' '}
                        {appointment.end_time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isMentor
                          ? m.appointment_client_label({
                              name: otherPerson?.name ?? '—',
                            })
                          : m.appointment_mentor_label({
                              name: otherPerson?.name ?? '—',
                            })}
                      </p>
                      <p className="text-xs font-medium">
                        {cancelled
                          ? m.appointment_status_cancelled()
                          : m.appointment_status_confirmed()}
                      </p>
                    </div>
                    {!cancelled ? (
                      <CtButton
                        variant="secondary"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate(appointment.id)}
                      >
                        {cancelMutation.isPending ? (
                          <CtSpinner className="size-4" />
                        ) : null}
                        {m.appointment_cancel()}
                      </CtButton>
                    ) : null}
                  </CtCardContent>
                </CtCard>
              )
            })}
          </div>
        )}
      </CtAsyncContent>
    </section>
  )
}
