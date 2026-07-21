import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtUserMenu } from '@/modules/app/components/layout/CtUserMenu'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useAuthSession } from '@/modules/auth/hooks'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'

function HeaderAuthActions({
  hasToken,
  isResolving,
  user,
}: Readonly<{
  hasToken: boolean
  isResolving: boolean
  user?: NonNullable<ReturnType<typeof useAuthSession>['user']>
}>) {
  if (isResolving) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block size-7 animate-pulse rounded-lg bg-muted" aria-hidden />
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
      </div>
    )
  }

  if (hasToken && user) {
    return <CtUserMenu user={user} />
  }

  if (hasToken) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block size-7 animate-pulse rounded-lg bg-muted" aria-hidden />
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
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
            user={user}
          />
        </div>
      </div>
    </header>
  )
}
