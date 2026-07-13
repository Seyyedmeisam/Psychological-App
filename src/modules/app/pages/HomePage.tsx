import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { useMe } from '@/modules/auth/hooks'
import { CtGroup } from '@/modules/app/components/surface/CtGroup'
import { CtSurface } from '@/modules/app/components/surface/CtSurface'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'

export default function HomePage() {
  const { data: user } = useMe()

  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-10 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.home_title()}</CtCardTitle>
          <CtCardDescription className="text-base leading-relaxed">{m.home_description()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtSurface title={user ? m.nav_books() : m.auth_get_started()}>
        <CtGroup>
          <CtCard variant="grouped" className="border-0 shadow-none">
            <CtCardContent className="flex flex-wrap gap-3 py-4">
              {user ? (
                <>
                  <CtButton asChild>
                    <Link to="/books">{m.home_browse_books()}</Link>
                  </CtButton>
                  <CtButton asChild variant="secondary">
                    <Link to="/about">{m.home_about()}</Link>
                  </CtButton>
                </>
              ) : (
                <>
                  <CtButton asChild>
                    <Link to="/register">{m.auth_get_started()}</Link>
                  </CtButton>
                  <CtButton asChild variant="tinted">
                    <Link to="/login">{m.auth_login()}</Link>
                  </CtButton>
                </>
              )}
            </CtCardContent>
          </CtCard>
        </CtGroup>
      </CtSurface>
    </section>
  )
}
