import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtLoginForm } from '@/modules/auth/components/CtLoginForm'

const LOGIN_VISUAL =
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80'

export default function LoginPage() {
  return (
    <section className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_80%_at_0%_0%,oklch(0.92_0.04_230),transparent_55%),radial-gradient(90%_70%_at_100%_100%,oklch(0.93_0.03_200),transparent_50%),var(--background)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-s-24 top-16 -z-10 size-72 rounded-full bg-primary/10 blur-3xl motion-safe:animate-[login-breathe_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-e-16 bottom-10 -z-10 size-80 rounded-full bg-[oklch(0.78_0.06_195/0.35)] blur-3xl motion-safe:animate-[login-breathe_10s_ease-in-out_infinite_reverse]"
      />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-stretch gap-0 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-12">
        <aside className="login-panel-reveal relative mb-8 flex min-h-56 flex-col justify-end overflow-hidden rounded-3xl border border-border/60 motion-safe:transition-[transform,box-shadow] motion-safe:duration-500 motion-safe:ease-(--motion-ease-out) hover:shadow-ios-md sm:min-h-72 lg:mb-0 lg:min-h-[min(70vh,36rem)] lg:hover:-translate-y-0.5">
          <img
            src={LOGIN_VISUAL}
            alt=""
            className="absolute inset-0 -z-20 size-full object-cover object-[center_25%] motion-safe:animate-[login-kenburns_22s_ease-out_forwards]"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-foreground/80 via-foreground/35 to-foreground/10" />
          <div className="relative z-10 space-y-3 p-6 sm:p-8 lg:p-10">
            <p
              className="login-reveal text-sm font-semibold tracking-wide text-primary-foreground/90"
              style={{ animationDelay: '120ms' }}
            >
              {m.app_name()}
            </p>
            <h1
              className="login-reveal max-w-md text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-4xl"
              style={{ animationDelay: '220ms' }}
            >
              {m.auth_login_title()}
            </h1>
            <p
              className="login-reveal max-w-sm text-sm leading-relaxed text-primary-foreground/85 sm:text-base"
              style={{ animationDelay: '340ms' }}
            >
              {m.auth_login_subtitle()}
            </p>
          </div>
        </aside>

        <div className="flex items-center justify-center lg:justify-end">
          <div
            className="login-panel-reveal w-full max-w-md"
            style={{ animationDelay: '180ms' }}
          >
            <CtCard className="border border-border/70 shadow-ios-md transition-[box-shadow,transform] duration-(--motion-duration-normal) ease-(--motion-ease-out) hover:-translate-y-0.5 hover:shadow-[0_8px_28px_oklch(0_0_0/0.08)]">
              <CtCardHeader className="pb-2">
                <CtCardTitle
                  className="login-reveal text-xl sm:text-2xl"
                  style={{ animationDelay: '280ms' }}
                >
                  {m.auth_login()}
                </CtCardTitle>
                <CtCardDescription
                  className="login-reveal"
                  style={{ animationDelay: '360ms' }}
                >
                  {m.auth_profile_sign_in_description()}
                </CtCardDescription>
              </CtCardHeader>
              <CtCardContent className="pt-2">
                <CtLoginForm />
              </CtCardContent>
            </CtCard>

            <p
              className="login-reveal mt-5 text-center text-sm text-muted-foreground"
              style={{ animationDelay: '620ms' }}
            >
              <Link
                to="/"
                className="font-medium text-foreground/80 underline-offset-4 transition-colors duration-(--motion-duration-fast) hover:text-primary hover:underline"
              >
                {m.nav_home()}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
