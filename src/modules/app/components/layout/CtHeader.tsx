import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useLogout, useMe } from '@/modules/auth/hooks'

const navItems = [
  { to: '/users' as const, label: () => m.nav_users() },
  { to: '/books' as const, label: () => m.nav_books() },
  { to: '/about' as const, label: () => m.nav_about() },
  { to: '/profile' as const, label: () => m.nav_profile() },
]

export function CtHeader() {
  const { data: user } = useMe()
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-ios-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <CtAppLogo />
        <div className="flex flex-wrap items-center gap-4">
          <nav className="flex flex-wrap items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary [&.active]:text-primary"
              >
                {item.label()}
              </Link>
            ))}
          </nav>
          <CtLocaleSwitcher />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <CtButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                {m.auth_logout()}
              </CtButton>
            </div>
          ) : (
            <CtButton asChild size="sm" variant="outline">
              <Link to="/login">{m.auth_login()}</Link>
            </CtButton>
          )}
        </div>
      </div>
    </header>
  )
}
