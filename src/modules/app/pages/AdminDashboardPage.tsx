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

export default function AdminDashboardPage() {
  const { data: user } = useMe()

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 ios-slide-up">
      <CtCard variant="inset" className="mb-6">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{m.dashboard_title()}</CtCardTitle>
          <CtCardDescription>
            {m.dashboard_welcome({ name: user?.name ?? '' })}
          </CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <CtSurface title={m.nav_users()}>
          <CtGroup>
            <CtCard variant="grouped" className="border-0 shadow-none">
              <CtCardContent className="flex flex-col gap-3 py-4">
                <p className="text-sm text-muted-foreground">{m.dashboard_users_hint()}</p>
                <div className="flex flex-wrap gap-3">
                  <CtButton asChild>
                    <Link to="/users">{m.nav_users()}</Link>
                  </CtButton>
                  <CtButton asChild variant="secondary">
                    <Link to="/users/upsert">{m.users_add()}</Link>
                  </CtButton>
                </div>
              </CtCardContent>
            </CtCard>
          </CtGroup>
        </CtSurface>

        <CtSurface title={m.nav_profile()}>
          <CtGroup>
            <CtCard variant="grouped" className="border-0 shadow-none">
              <CtCardContent className="flex flex-wrap gap-3 py-4">
                <CtButton asChild variant="outline">
                  <Link to="/profile">{m.nav_profile()}</Link>
                </CtButton>
              </CtCardContent>
            </CtCard>
          </CtGroup>
        </CtSurface>
      </div>
    </section>
  )
}
