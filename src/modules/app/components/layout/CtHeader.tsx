import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAppLogo } from '@/modules/app/components/layout/CtAppLogo'
import { CtLocaleSwitcher } from '@/modules/app/components/locale/CtLocaleSwitcher'
import { CtButton } from '@/modules/app/components/CtButton'
import { useLogout, useMe } from '@/modules/auth/hooks'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'

export function CtHeader() {
  const { data: user } = useMe()
  const logout = useLogout()
  const { setMobileOpen, toggleCollapsed } = useSidebar()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 shadow-ios-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
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
