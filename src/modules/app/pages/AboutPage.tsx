import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'

const services = [
  {
    icon: Sparkles,
    title: () => m.about_service_1_title(),
    body: () => m.about_service_1_body(),
  },
  {
    icon: CalendarCheck2,
    title: () => m.about_service_2_title(),
    body: () => m.about_service_2_body(),
  },
  {
    icon: ShieldCheck,
    title: () => m.about_service_3_title(),
    body: () => m.about_service_3_body(),
  },
] as const

const audiences = [
  {
    icon: UserRound,
    title: () => m.about_audience_client_title(),
    body: () => m.about_audience_client_body(),
  },
  {
    icon: HeartHandshake,
    title: () => m.about_audience_mentor_title(),
    body: () => m.about_audience_mentor_body(),
  },
  {
    icon: Users,
    title: () => m.about_audience_admin_title(),
    body: () => m.about_audience_admin_body(),
  },
] as const

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_0%,oklch(0.92_0.04_230/0.75),transparent_55%),radial-gradient(80%_60%_at_100%_100%,oklch(0.93_0.03_200/0.55),transparent_50%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="home-reveal text-sm font-semibold tracking-wide text-primary">
            {m.app_name()}
          </p>
          <h1
            className="home-reveal mt-3 max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            {m.about_hero_title()}
          </h1>
          <p
            className="home-reveal mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            {m.about_hero_subtitle()}
          </p>
          <div
            className="home-reveal mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <CtButton asChild size="lg">
              <Link to="/register">{m.auth_get_started()}</Link>
            </CtButton>
            <CtButton asChild size="lg" variant="secondary">
              <Link to="/login">{m.auth_login()}</Link>
            </CtButton>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.about_services_title()}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              {m.about_services_subtitle()}
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title()}>
                  <CtCard className="home-card-lift home-card-lift-hover h-full border border-border/70">
                    <CtCardHeader>
                      <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <CtCardTitle className="text-lg">{item.title()}</CtCardTitle>
                      <CtCardDescription className="leading-relaxed">
                        {item.body()}
                      </CtCardDescription>
                    </CtCardHeader>
                  </CtCard>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-card px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.about_audiences_title()}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              {m.about_audiences_subtitle()}
            </p>
          </div>
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {audiences.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title()}>
                  <CtCard className="home-card-lift home-card-lift-hover h-full border border-border/70">
                    <CtCardHeader>
                      <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <CtCardTitle className="text-lg">{item.title()}</CtCardTitle>
                      <CtCardDescription className="leading-relaxed">
                        {item.body()}
                      </CtCardDescription>
                    </CtCardHeader>
                  </CtCard>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.about_mission_title()}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {m.about_mission_body()}
            </p>
          </div>
          <CtCard className="border border-border/70 bg-card/90 shadow-ios-md">
            <CtCardHeader className="gap-3">
              <CtCardTitle className="text-lg">{m.about_promise_title()}</CtCardTitle>
              <CtCardDescription className="text-sm leading-relaxed sm:text-base">
                {m.about_promise_body()}
              </CtCardDescription>
            </CtCardHeader>
          </CtCard>
        </div>
      </section>

      <section className="bg-card px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {m.about_cta_title()}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            {m.about_cta_body()}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtButton asChild size="lg">
              <Link to="/register">{m.auth_get_started()}</Link>
            </CtButton>
            <CtButton asChild size="lg" variant="outline">
              <Link to="/">{m.nav_home()}</Link>
            </CtButton>
          </div>
        </div>
      </section>
    </div>
  )
}
