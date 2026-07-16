import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useAuthSession, useLogout } from '@/modules/auth/hooks'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'

function HeaderAuthActions({
  hasToken,
  isResolving,
  userName,
  logoutPending,
  onLogout,
}: Readonly<{
  hasToken: boolean
  isResolving: boolean
  userName?: string
  logoutPending: boolean
  onLogout: () => void
}>) {
  if (isResolving) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
        <span className="inline-block h-9 w-20 animate-pulse rounded-xl bg-muted" aria-hidden />
      </div>
    )
  }

  if (hasToken) {
    return (
      <div className="flex items-center gap-2">
        {userName ? (
          <span className="text-sm text-muted-foreground">{userName}</span>
        ) : (
          <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
        )}
        <CtButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onLogout}
          disabled={logoutPending}
        >
          {m.auth_logout()}
        </CtButton>
      </div>
    )
  }

  return (
    <CtButton asChild size="sm" variant="outline">
      <Link to="/login">{m.auth_login()}</Link>
    </CtButton>
  )
}

export function CtHeader() {
  const { hasToken, user, isResolving } = useAuthSession()
  const logout = useLogout()
  const { setMobileOpen, toggleCollapsed } = useSidebar()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/85 shadow-ios-sm backdrop-blur-xl">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <CtButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </CtButton>
          <CtButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="hidden lg:inline-flex"
            onClick={toggleCollapsed}
            aria-label="Toggle sidebar"
          >
            <Menu className="size-4" />
          </CtButton>
          <CtAppLogo />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <CtLocaleSwitcher />
          <HeaderAuthActions
            hasToken={hasToken}
            isResolving={isResolving}
            userName={user?.name}
            logoutPending={logout.isPending}
            onLogout={() => logout.mutate()}
          />
        </div>
      </div>
    </header>
  )
}
