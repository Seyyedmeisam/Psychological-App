import { Link } from '@tanstack/react-router'
import { BookOpen, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { useAuthSession } from '@/modules/auth/hooks'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtHomeSlider } from '@/modules/app/components/home/CtHomeSlider'
import { getHomePathByRole } from '@/modules/auth/utils/homePath'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80'

const articleImages = [
  'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516302752623-603f376f5ace?auto=format&fit=crop&w=900&q=80',
] as const

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
    image: articleImages[0],
  },
  {
    tag: () => m.home_article_2_tag(),
    title: () => m.home_article_2_title(),
    excerpt: () => m.home_article_2_excerpt(),
    image: articleImages[1],
  },
  {
    tag: () => m.home_article_3_tag(),
    title: () => m.home_article_3_title(),
    excerpt: () => m.home_article_3_excerpt(),
    image: articleImages[2],
  },
] as const

const steps = [
  {
    n: '1',
    title: () => m.home_step_1_title(),
    body: () => m.home_step_1_body(),
  },
  {
    n: '2',
    title: () => m.home_step_2_title(),
    body: () => m.home_step_2_body(),
  },
  {
    n: '3',
    title: () => m.home_step_3_title(),
    body: () => m.home_step_3_body(),
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
      <section className="relative isolate min-h-[min(92vh,40rem)] overflow-hidden border-b border-border sm:min-h-[min(88vh,44rem)]">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[center_30%] motion-safe:animate-[login-kenburns_24s_ease-out_forwards]"
        />
        <div className="absolute inset-0 -z-10 bg-card/78 sm:bg-card/72" />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-s-20 top-10 -z-10 size-64 rounded-full bg-primary/15 blur-3xl motion-safe:animate-[login-breathe_9s_ease-in-out_infinite]"
        />
        <div className="mx-auto flex min-h-[min(92vh,40rem)] w-full max-w-6xl items-end px-4 py-14 sm:min-h-[min(88vh,44rem)] sm:items-center sm:px-6 sm:py-20">
          <div className="max-w-xl">
            <p
              className="home-reveal mb-4 text-sm font-semibold tracking-wide text-primary"
              style={{ animationDelay: '80ms' }}
            >
              {m.app_name()}
            </p>
            <h1
              className="home-reveal text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              style={{ animationDelay: '160ms' }}
            >
              {m.home_hero_title()}
            </h1>
            <p
              className="home-reveal mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: '260ms' }}
            >
              {m.home_hero_subtitle()}
            </p>
            <div
              className="home-reveal mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: '360ms' }}
            >
              {isResolving ? (
                <>
                  <span className="inline-block h-12 w-36 animate-pulse rounded-xl bg-muted" aria-hidden />
                  <span className="inline-block h-12 w-28 animate-pulse rounded-xl bg-muted" aria-hidden />
                </>
              ) : (
                <>
                  <CtButton
                    asChild
                    size="lg"
                    className="transition-transform duration-(--motion-duration-fast) hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link to={primaryTo}>{primaryLabel}</Link>
                  </CtButton>
                  <CtButton
                    asChild
                    size="lg"
                    variant="secondary"
                    className="transition-transform duration-(--motion-duration-fast) hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link to={secondaryTo}>{secondaryLabel}</Link>
                  </CtButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="home-reveal text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.home_values_title()}
            </h2>
            <p
              className="home-reveal mt-3 text-pretty text-muted-foreground"
              style={{ animationDelay: '100ms' }}
            >
              {m.home_values_subtitle()}
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {values.map((item, i) => {
              const Icon = item.icon
              return (
                <li
                  key={item.title()}
                  className="home-reveal"
                  style={{ animationDelay: `${160 + i * 100}ms` }}
                >
                  <CtCard
                    className={cn(
                      'home-card-lift home-card-lift-hover h-full border border-border/70',
                    )}
                  >
                    <CtCardHeader>
                      <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-(--motion-duration-normal) group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <CtCardTitle className="text-lg">{item.title()}</CtCardTitle>
                      <CtCardDescription className="text-sm leading-relaxed">
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
          <div className="mb-8 max-w-2xl">
            <div
              className="home-reveal mb-3 inline-flex items-center gap-2 text-primary"
              style={{ animationDelay: '60ms' }}
            >
              <BookOpen className="size-4" aria-hidden />
              <span className="text-sm font-semibold">{m.home_articles_kicker()}</span>
            </div>
            <h2
              className="home-reveal text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              style={{ animationDelay: '120ms' }}
            >
              {m.home_articles_title()}
            </h2>
            <p
              className="home-reveal mt-3 text-pretty text-muted-foreground"
              style={{ animationDelay: '180ms' }}
            >
              {m.home_articles_subtitle()}
            </p>
          </div>

          <div className="home-reveal" style={{ animationDelay: '240ms' }}>
            <CtHomeSlider
              previousLabel={m.home_slider_previous()}
              nextLabel={m.home_slider_next()}
            >
              {articles.map((article) => (
                <CtCard
                  key={article.title()}
                  className="home-card-lift home-card-lift-hover h-full overflow-hidden border border-border/70 py-0"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt=""
                      className="size-full object-cover transition-transform duration-700 ease-(--motion-ease-out) hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent" />
                  </div>
                  <CtCardHeader className="pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {article.tag()}
                    </p>
                    <CtCardTitle className="text-lg leading-snug">
                      {article.title()}
                    </CtCardTitle>
                  </CtCardHeader>
                  <CtCardContent className="pb-5">
                    <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {article.excerpt()}
                    </p>
                  </CtCardContent>
                </CtCard>
              ))}
            </CtHomeSlider>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="home-reveal text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.home_approach_title()}
            </h2>
            <p
              className="home-reveal mt-4 text-pretty leading-relaxed text-muted-foreground"
              style={{ animationDelay: '100ms' }}
            >
              {m.home_approach_body()}
            </p>
          </div>

          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="home-reveal"
                style={{ animationDelay: `${160 + i * 110}ms` }}
              >
                <CtCard className="home-card-lift home-card-lift-hover h-full border border-border/70">
                  <CtCardHeader>
                    <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                      {step.n}
                    </span>
                    <CtCardTitle className="text-base">{step.title()}</CtCardTitle>
                    <CtCardDescription>{step.body()}</CtCardDescription>
                  </CtCardHeader>
                </CtCard>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-card px-4 py-14 sm:px-6 sm:py-16">
        <div className="home-reveal mx-auto max-w-3xl">
          <CtCard className="home-card-lift border border-border/70 text-center shadow-ios-md">
            <CtCardHeader className="items-center">
              <CtCardTitle className="text-2xl sm:text-3xl">
                {m.home_cta_title()}
              </CtCardTitle>
              <CtCardDescription className="mx-auto max-w-xl text-base">
                {m.home_cta_body()}
              </CtCardDescription>
            </CtCardHeader>
            <CtCardContent className="flex flex-wrap justify-center gap-3 pb-6">
              <CtButton
                asChild
                size="lg"
                className="transition-transform duration-(--motion-duration-fast) hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to={primaryTo}>{primaryLabel}</Link>
              </CtButton>
              <CtButton
                asChild
                size="lg"
                variant="outline"
                className="transition-transform duration-(--motion-duration-fast) hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link to="/about">{m.home_about()}</Link>
              </CtButton>
            </CtCardContent>
          </CtCard>
        </div>
      </section>
    </div>
  )
}
