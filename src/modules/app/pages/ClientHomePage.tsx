import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { useMe } from '@/modules/auth/hooks'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtGroup } from '@/modules/app/components/surface/CtGroup'
import { CtSurface } from '@/modules/app/components/surface/CtSurface'

export default function ClientHomePage() {
  const { data: user } = useMe()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.client_home_title()}</CtCardTitle>
          <CtCardDescription>
            {m.client_home_welcome({ name: user?.name ?? '' })}
          </CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtSurface title={m.client_home_actions()}>
        <CtGroup>
          <CtCard variant="grouped" className="border-0 shadow-none">
            <CtCardContent className="flex flex-wrap gap-3 py-4">
              <CtButton asChild>
                <Link to="/appointments/book">{m.nav_book_appointment()}</Link>
              </CtButton>
              <CtButton asChild variant="secondary">
                <Link to="/appointments">{m.nav_my_appointments()}</Link>
              </CtButton>
              <CtButton asChild variant="secondary">
                <Link to="/profile">{m.nav_profile()}</Link>
              </CtButton>
            </CtCardContent>
          </CtCard>
        </CtGroup>
      </CtSurface>
    </section>
  )
}
