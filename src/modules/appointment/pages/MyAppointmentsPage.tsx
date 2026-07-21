import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import { CtCard, CtCardContent } from '@/modules/app/components/CtCard'
import { useMe } from '@/modules/auth/hooks'
import { CtAppointmentListCard } from '@/modules/appointment/components/CtAppointmentListCard'
import {
  useCancelAppointment,
  useMyAppointments,
  useRateAppointment,
} from '@/modules/appointment/hooks'

export default function MyAppointmentsPage() {
  const { data: user } = useMe()
  const appointmentsQuery = useMyAppointments({
    refetchInterval: 60_000,
  })
  const cancelMutation = useCancelAppointment()
  const rateMutation = useRateAppointment()
  const isMentor = user?.role === 'mentor'
  const isClient = user?.role === 'user'
  const isAdmin = user?.role === 'admin'

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        title={m.appointment_mine_title()}
        description={
          isAdmin
            ? m.appointment_mine_subtitle_admin()
            : isMentor
              ? m.appointment_mine_subtitle_mentor()
              : m.appointment_mine_subtitle()
        }
        action={
          user?.role === 'user' ? (
            <CtButton asChild className="shrink-0">
              <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
            </CtButton>
          ) : null
        }
      />

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
            {(appointmentsQuery.data ?? []).map((appointment) => (
              <CtAppointmentListCard
                key={appointment.id}
                appointment={appointment}
                isMentor={isMentor}
                isClient={isClient}
                isAdmin={isAdmin}
                cancelPending={cancelMutation.isPending}
                ratePending={rateMutation.isPending}
                onCancel={(id) => cancelMutation.mutate(id)}
                onRate={(appointmentId, score) =>
                  rateMutation.mutate({ appointmentId, score })
                }
              />
            ))}
          </div>
        )}
      </CtAsyncContent>
    </section>
  )
}
