import { Link } from '@tanstack/react-router'
import { BookOpen, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { useAuthSession } from '@/modules/auth/hooks'
import { CtButton } from '@/modules/app/components/CtButton'
import { getHomePathByRole } from '@/modules/auth/utils/homePath'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80'

const values = [
  {
    icon: HeartHandshake,
    title: () => m.home_value_1_title(),
    body: () => m.home_value_1_body(),
  },
  {
    icon: ShieldCheck,
    title: () => m.home_value_2_title(),
    body: () => m.home_value_2_body(),
  },
  {
    icon: Sparkles,
    title: () => m.home_value_3_title(),
    body: () => m.home_value_3_body(),
  },
] as const

const articles = [
  {
    tag: () => m.home_article_1_tag(),
    title: () => m.home_article_1_title(),
    excerpt: () => m.home_article_1_excerpt(),
  },
  {
    tag: () => m.home_article_2_tag(),
    title: () => m.home_article_2_title(),
    excerpt: () => m.home_article_2_excerpt(),
  },
  {
    tag: () => m.home_article_3_tag(),
    title: () => m.home_article_3_title(),
    excerpt: () => m.home_article_3_excerpt(),
  },
] as const

export default function HomePage() {
  const { hasToken, user, isResolving } = useAuthSession()

  let primaryTo: '/register' | '/profile' | '/dashboard' | '/home' | '/mentor' = '/register'
  let primaryLabel = m.auth_get_started()
  let secondaryTo: '/login' | '/about' = '/login'
  let secondaryLabel = m.auth_login()

  if (user) {
    primaryTo = getHomePathByRole(user.role)
    primaryLabel = m.home_continue_cta()
    secondaryTo = '/about'
    secondaryLabel = m.home_about()
  } else if (hasToken) {
    primaryTo = '/profile'
    primaryLabel = m.home_continue_cta()
    secondaryTo = '/about'
    secondaryLabel = m.home_about()
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative isolate min-h-[min(92vh,40rem)] overflow-hidden border-b border-border sm:min-h-[min(88vh,44rem)]">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-card/78 sm:bg-card/72" />
        <div className="mx-auto flex min-h-[min(92vh,40rem)] w-full max-w-6xl items-end px-4 py-14 sm:min-h-[min(88vh,44rem)] sm:items-center sm:px-6 sm:py-20">
          <div className="ios-slide-up max-w-xl">
            <p className="mb-4 text-sm font-semibold tracking-wide text-primary">{m.app_name()}</p>
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {m.home_hero_title()}
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {m.home_hero_subtitle()}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isResolving ? (
                <>
                  <span className="inline-block h-12 w-36 animate-pulse rounded-xl bg-muted" aria-hidden />
                  <span className="inline-block h-12 w-28 animate-pulse rounded-xl bg-muted" aria-hidden />
                </>
              ) : (
                <>
                  <CtButton asChild size="lg">
                    <Link to={primaryTo}>{primaryLabel}</Link>
                  </CtButton>
                  <CtButton asChild size="lg" variant="secondary">
                    <Link to={secondaryTo}>{secondaryLabel}</Link>
                  </CtButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.home_values_title()}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">{m.home_values_subtitle()}</p>
          </div>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {values.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.title()} className="ios-fade-in text-start">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title()}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body()}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Articles */}
      <section className="border-b border-border bg-card px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-primary">
                <BookOpen className="size-4" aria-hidden />
                <span className="text-sm font-semibold">{m.home_articles_kicker()}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {m.home_articles_title()}
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground">{m.home_articles_subtitle()}</p>
            </div>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {articles.map((article) => (
              <article key={article.title()} className="grid gap-3 py-8 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:pt-1">
                  {article.tag()}
                </p>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {article.title()}
                  </h3>
                  <p className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {article.excerpt()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.home_approach_title()}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {m.home_approach_body()}
            </p>
          </div>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                1
              </span>
              <div>
                <p className="font-semibold text-foreground">{m.home_step_1_title()}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.home_step_1_body()}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                2
              </span>
              <div>
                <p className="font-semibold text-foreground">{m.home_step_2_title()}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.home_step_2_body()}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                3
              </span>
              <div>
                <p className="font-semibold text-foreground">{m.home_step_3_title()}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.home_step_3_body()}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-card px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {m.home_cta_title()}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">{m.home_cta_body()}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtButton asChild size="lg">
              <Link to={primaryTo}>{primaryLabel}</Link>
            </CtButton>
            <CtButton asChild size="lg" variant="outline">
              <Link to="/about">{m.home_about()}</Link>
            </CtButton>
          </div>
        </div>
      </section>
    </div>
  )
}
