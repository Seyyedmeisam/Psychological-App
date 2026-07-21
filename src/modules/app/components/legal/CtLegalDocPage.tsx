import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, CalendarClock } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import { cn } from '@/lib/utils'

type DocSection = {
  id: string
  title: () => string
  body: () => string
  icon: LucideIcon
}

type DocPillar = {
  label: () => string
}

type RelatedLink = {
  to: '/privacy' | '/terms' | '/faq' | '/about' | '/contact'
  label: () => string
  description: () => string
}

function LegalBody({ text }: Readonly<{ text: string }>) {
  const blocks: Array<
    | { type: 'p'; key: string; text: string }
    | { type: 'ul'; key: string; items: string[] }
  > = []
  let bullets: string[] = []
  let blockSeq = 0

  const flushBullets = () => {
    if (bullets.length === 0) return
    blockSeq += 1
    blocks.push({ type: 'ul', key: `ul-${blockSeq}-${bullets[0]}`, items: bullets })
    bullets = []
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flushBullets()
      continue
    }
    if (line.startsWith('•') || line.startsWith('-')) {
      bullets.push(line.replace(/^[•-]\s*/, ''))
      continue
    }
    flushBullets()
    blockSeq += 1
    blocks.push({ type: 'p', key: `p-${blockSeq}-${line.slice(0, 24)}`, text: line })
  }
  flushBullets()

  return (
    <div className="space-y-3 text-pretty leading-relaxed text-muted-foreground">
      {blocks.map((block) =>
        block.type === 'p' ? (
          <p key={block.key}>{block.text}</p>
        ) : (
          <ul key={block.key} className="space-y-2 ps-1">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 text-start">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

export function CtLegalDocPage({
  variant,
  title,
  subtitle,
  updated,
  intro,
  highlightTitle,
  highlightBody,
  HighlightIcon,
  pillars,
  sections,
  related,
}: Readonly<{
  variant: 'privacy' | 'terms'
  title: string
  subtitle: string
  updated: string
  intro: string
  highlightTitle: string
  highlightBody: string
  HighlightIcon: LucideIcon
  pillars: readonly DocPillar[]
  sections: readonly DocSection[]
  related: readonly RelatedLink[]
}>) {
  const isPrivacy = variant === 'privacy'

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 -z-10',
            isPrivacy
              ? 'bg-[radial-gradient(90%_70%_at_0%_0%,oklch(0.92_0.04_230/0.8),transparent_55%),radial-gradient(75%_55%_at_100%_10%,oklch(0.93_0.035_200/0.55),transparent_50%),radial-gradient(60%_50%_at_70%_100%,oklch(0.94_0.02_250/0.45),transparent_45%)]'
              : 'bg-[radial-gradient(90%_70%_at_100%_0%,oklch(0.93_0.035_250/0.75),transparent_55%),radial-gradient(80%_60%_at_0%_100%,oklch(0.94_0.03_210/0.5),transparent_50%),radial-gradient(55%_45%_at_40%_20%,oklch(0.95_0.02_280/0.35),transparent_40%)]',
          )}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 size-56 rounded-full bg-primary/10 blur-3xl motion-safe:animate-[login-breathe_8s_ease-in-out_infinite] max-sm:hidden"
          style={{ insetInlineEnd: '8%', top: '12%' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 size-40 rounded-full bg-accent/40 blur-2xl motion-safe:animate-[login-soft-float_7s_ease-in-out_infinite] max-sm:hidden"
          style={{ insetInlineStart: '6%', bottom: '8%' }}
        />

        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="login-reveal flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold tracking-wide text-primary">{m.app_name()}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <CalendarClock className="size-3.5" aria-hidden />
              {updated}
            </span>
          </div>

          <h1
            className="login-reveal mt-4 max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ animationDelay: '70ms' }}
          >
            {title}
          </h1>
          <p
            className="login-reveal mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: '140ms' }}
          >
            {subtitle}
          </p>

          <ul
            className="login-reveal mt-8 flex flex-wrap gap-2"
            style={{ animationDelay: '210ms' }}
          >
            {pillars.map((pillar) => (
              <li
                key={pillar.label()}
                className="rounded-full border border-border/70 bg-background/75 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-ios-sm backdrop-blur-sm"
              >
                {pillar.label()}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {m.legal_on_this_page()}
            </p>
            <nav aria-label={m.legal_on_this_page()} className="mt-4">
              <ol className="space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-start gap-3 rounded-xl px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                    >
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card text-[11px] font-semibold text-primary transition-colors group-hover:border-primary/30">
                        {index + 1}
                      </span>
                      <span className="text-start leading-snug">{section.title()}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0">
            <div
              className={cn(
                'login-panel-reveal relative overflow-hidden rounded-2xl border px-5 py-5 sm:px-6 sm:py-6',
                isPrivacy
                  ? 'border-primary/20 bg-primary/5'
                  : 'border-amber-500/25 bg-amber-500/5',
              )}
            >
              <div className="flex gap-4">
                <div
                  className={cn(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-xl',
                    isPrivacy
                      ? 'bg-primary/15 text-primary'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                  )}
                >
                  <HighlightIcon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 text-start">
                  <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {highlightTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {highlightBody}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-pretty text-base leading-relaxed text-muted-foreground">
              {intro}
            </p>

            <div className="mt-10 space-y-5">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 rounded-2xl border border-border/80 bg-card/80 p-5 shadow-ios-sm sm:p-6"
                    style={{
                      animationDelay: `${Math.min(index * 40, 200)}ms`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-xs font-semibold tracking-wide text-primary">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                            {section.title()}
                          </h2>
                        </div>
                        <div className="mt-4">
                          <LegalBody text={section.body()} />
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/35 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {m.legal_related_title()}
            </h2>
            <p className="mt-2 text-pretty text-muted-foreground">{m.legal_related_body()}</p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="home-card-lift home-card-lift-hover group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-ios-sm"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {item.label()}
                    <ArrowUpRight
                      className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <CtButton asChild>
              <Link to="/faq">{m.legal_read_faq()}</Link>
            </CtButton>
            <CtButton asChild variant="secondary">
              <Link to="/contact">{m.legal_contact_us()}</Link>
            </CtButton>
          </div>
        </div>
      </section>
    </div>
  )
}
