import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'

const faqs = [
  {
    q: () => m.faq_q1(),
    a: () => m.faq_a1(),
  },
  {
    q: () => m.faq_q2(),
    a: () => m.faq_a2(),
  },
  {
    q: () => m.faq_q3(),
    a: () => m.faq_a3(),
  },
  {
    q: () => m.faq_q4(),
    a: () => m.faq_a4(),
  },
  {
    q: () => m.faq_q5(),
    a: () => m.faq_a5(),
  },
  {
    q: () => m.faq_q6(),
    a: () => m.faq_a6(),
  },
  {
    q: () => m.faq_q7(),
    a: () => m.faq_a7(),
  },
  {
    q: () => m.faq_q8(),
    a: () => m.faq_a8(),
  },
] as const

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_0%,oklch(0.92_0.04_230/0.75),transparent_55%),radial-gradient(80%_60%_at_100%_100%,oklch(0.93_0.03_200/0.55),transparent_50%)]"
        />
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-primary">{m.app_name()}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {m.faq_title()}
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {m.faq_subtitle()}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q()}
              className="group rounded-2xl border border-border/80 bg-card shadow-ios-sm open:shadow-ios-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-start text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden sm:text-base">
                <span>{item.q()}</span>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--motion-duration-normal) ease-(--motion-ease-out) group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-border/70 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {item.a()}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border/80 bg-secondary/50 px-5 py-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">{m.faq_more_title()}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{m.faq_more_body()}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <CtButton asChild>
              <Link to="/about">{m.nav_about()}</Link>
            </CtButton>
            <CtButton asChild variant="secondary">
              <Link to="/register">{m.auth_get_started()}</Link>
            </CtButton>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="font-medium text-primary hover:underline">
            {m.nav_privacy()}
          </Link>
          <Link to="/terms" className="font-medium text-primary hover:underline">
            {m.nav_terms()}
          </Link>
        </div>
      </section>
    </div>
  )
}
