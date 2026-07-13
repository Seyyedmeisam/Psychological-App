import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { useMe } from '@/modules/app/hooks'
import { Button } from '@/modules/app/components/ui/button'

export function CtPublicHeader() {
  const { data: user } = useMe()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <CtAppLogo />
        <div className="flex flex-wrap items-center gap-3">
          <CtLocaleSwitcher />
          {user ? (
            <Button asChild size="sm">
              <Link to="/books">{m.nav_books()}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{m.auth_login()}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">{m.auth_register()}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
