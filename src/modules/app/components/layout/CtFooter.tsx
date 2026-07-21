import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'

export function CtFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-muted-foreground sm:text-start">
          {m.footer_copyright({
            year: String(new Date().getFullYear()),
            appName: m.app_name(),
          })}
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
          aria-label={m.app_name()}
        >
          <Link
            to="/about"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.nav_about()}
          </Link>
          <Link
            to="/contact"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.nav_contact()}
          </Link>
          <Link
            to="/faq"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.nav_faq()}
          </Link>
          <Link
            to="/privacy"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.nav_privacy()}
          </Link>
          <Link
            to="/terms"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {m.nav_terms()}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
