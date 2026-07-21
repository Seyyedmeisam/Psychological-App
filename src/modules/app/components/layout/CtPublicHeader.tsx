import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useAuthSession } from '@/modules/auth/hooks'

const navLinkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-(--motion-duration-fast) hover:bg-muted/60 hover:text-foreground [&.active]:bg-accent [&.active]:text-accent-foreground'

export function CtPublicHeader() {
  const { hasToken } = useAuthSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-ios-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <CtAppLogo />
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label={m.app_name()}
          >
            <Link to="/about" className={navLinkClass}>
              {m.nav_about()}
            </Link>
            <Link to="/contact" className={navLinkClass}>
              {m.nav_contact()}
            </Link>
            <Link to="/faq" className={navLinkClass}>
              {m.nav_faq()}
            </Link>
            <Link to="/privacy" className={navLinkClass}>
              {m.nav_privacy()}
            </Link>
            <Link to="/terms" className={navLinkClass}>
              {m.nav_terms()}
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1 md:hidden">
            <Link
              to="/about"
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {m.nav_about()}
            </Link>
            <Link
              to="/contact"
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {m.nav_contact()}
            </Link>
            <Link
              to="/faq"
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {m.nav_faq()}
            </Link>
          </div>
          <CtLocaleSwitcher />
          {hasToken ? (
            <CtButton asChild variant="ghost" size="sm">
              <Link to="/profile">{m.nav_profile()}</Link>
            </CtButton>
          ) : (
            <>
              <CtButton asChild variant="ghost" size="sm">
                <Link to="/login">{m.auth_login()}</Link>
              </CtButton>
              <CtButton asChild size="sm">
                <Link to="/register">{m.auth_register()}</Link>
              </CtButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
