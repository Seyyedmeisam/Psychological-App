import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useAuthSession } from '@/modules/auth/hooks'

export function CtPublicHeader() {
  const { hasToken } = useAuthSession()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-ios-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <CtAppLogo />
        <div className="flex flex-wrap items-center gap-3">
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
