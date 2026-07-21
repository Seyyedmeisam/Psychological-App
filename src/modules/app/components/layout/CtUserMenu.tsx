import { Link } from '@tanstack/react-router'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  CtDropdownMenu,
  CtDropdownMenuContent,
  CtDropdownMenuGroup,
  CtDropdownMenuItem,
  CtDropdownMenuSeparator,
  CtDropdownMenuTrigger,
} from '@/modules/app/components/CtDropdownMenuParts'
import { useLogout } from '@/modules/auth/hooks'
import { useAppLocale } from '@/modules/app/providers/CtI18nProvider'
import type { AuthUser } from '@/modules/auth/types'
import { cn } from '@/lib/utils'

function roleLabel(role: AuthUser['role']) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const second = parts[1] ?? ''
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

function MenuIcon({
  children,
  tone = 'default',
}: Readonly<{
  children: ReactNode
  tone?: 'default' | 'danger'
}>) {
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
        tone === 'danger'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-secondary text-foreground/80',
      )}
    >
      {children}
    </span>
  )
}

export function CtUserMenu({
  user,
}: Readonly<{
  user: AuthUser
}>) {
  const logout = useLogout()
  const { dir } = useAppLocale()

  return (
    <CtDropdownMenu dir={dir}>
      <CtDropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={m.nav_profile()}
          className={cn(
            'group inline-flex h-11 max-w-56 items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 pe-2.5 ps-1.5 text-start shadow-ios-sm backdrop-blur-md transition-[background-color,border-color,box-shadow,transform] duration-(--motion-duration-fast) ease-(--motion-ease-out)',
            'hover:border-primary/25 hover:bg-card hover:shadow-ios-md',
            'focus-visible:border-ring/40 focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none',
            'data-[state=open]:border-primary/30 data-[state=open]:bg-card data-[state=open]:shadow-ios-md',
          )}
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-xs font-bold text-primary-foreground">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <>
                {initials(user.name)}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent"
                />
              </>
            )}
          </span>

          <span className="hidden min-w-0 flex-1 flex-col sm:flex">
            <span className="truncate text-sm font-semibold leading-tight text-foreground">
              {user.name}
            </span>
            <span className="truncate text-[11px] leading-tight text-muted-foreground">
              {roleLabel(user.role)}
            </span>
          </span>

          <ChevronDown
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--motion-duration-normal) ease-(--motion-ease-out) group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </button>
      </CtDropdownMenuTrigger>

      <CtDropdownMenuContent align="end" className="w-72 p-0">
        <div className="relative overflow-hidden rounded-t-2xl border-b border-border/70 bg-linear-to-br from-primary/12 via-card to-card px-4 pb-4 pt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-e-8 -top-8 size-28 rounded-full bg-primary/15 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-ios-sm">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <>
                  {initials(user.name)}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent"
                  />
                </>
              )}
            </span>
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-base font-semibold text-foreground">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                {user.mobile}
              </p>
              <span className="mt-2 inline-flex rounded-lg bg-card/90 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/15">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-1.5">
          <CtDropdownMenuGroup>
            <CtDropdownMenuItem asChild>
              <Link to="/profile" className="font-medium">
                <MenuIcon>
                  <UserRound className="size-4" />
                </MenuIcon>
                <span className="flex min-w-0 flex-1 flex-col text-start">
                  <span>{m.nav_profile()}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {m.auth_profile_subtitle()}
                  </span>
                </span>
              </Link>
            </CtDropdownMenuItem>
          </CtDropdownMenuGroup>

          <CtDropdownMenuSeparator />

          <CtDropdownMenuItem
            variant="destructive"
            disabled={logout.isPending}
            className="font-medium"
            onSelect={(event) => {
              event.preventDefault()
              logout.mutate()
            }}
          >
            <MenuIcon tone="danger">
              <LogOut className="size-4" />
            </MenuIcon>
            <span className="text-start">{m.auth_logout()}</span>
          </CtDropdownMenuItem>
        </div>
      </CtDropdownMenuContent>
    </CtDropdownMenu>
  )
}
