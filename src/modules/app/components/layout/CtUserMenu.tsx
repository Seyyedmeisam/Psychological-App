import { Link } from '@tanstack/react-router'
import { ChevronDown, Info, LogOut, UserRound } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtDropdownMenu,
  CtDropdownMenuContent,
  CtDropdownMenuGroup,
  CtDropdownMenuItem,
  CtDropdownMenuLabel,
  CtDropdownMenuSeparator,
  CtDropdownMenuTrigger,
} from '@/modules/app/components/CtDropdownMenuParts'
import { useLogout } from '@/modules/auth/hooks'
import type { AuthUser } from '@/modules/auth/types'

function roleLabel(role: AuthUser['role']) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
}

export function CtUserMenu({
  user,
}: Readonly<{
  user: AuthUser
}>) {
  const logout = useLogout()

  return (
    <CtDropdownMenu>
      <CtDropdownMenuTrigger asChild>
        <CtButton
          type="button"
          variant="outline"
          size="sm"
          className="h-10 gap-2 pe-2 ps-1.5"
          aria-label={m.nav_profile()}
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
            {initials(user.name)}
          </span>
          <span className="hidden max-w-36 truncate text-sm font-medium sm:inline">
            {user.name}
          </span>
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </CtButton>
      </CtDropdownMenuTrigger>

      <CtDropdownMenuContent align="end" className="w-56">
        <CtDropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {roleLabel(user.role)}
              {user.mobile ? ` · ${user.mobile}` : null}
            </span>
          </div>
        </CtDropdownMenuLabel>

        <CtDropdownMenuSeparator />

        <CtDropdownMenuGroup>
          <CtDropdownMenuItem asChild>
            <Link to="/profile">
              <UserRound />
              {m.nav_profile()}
            </Link>
          </CtDropdownMenuItem>
          <CtDropdownMenuItem asChild>
            <Link to="/about">
              <Info />
              {m.nav_about()}
            </Link>
          </CtDropdownMenuItem>
        </CtDropdownMenuGroup>

        <CtDropdownMenuSeparator />

        <CtDropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onSelect={(event) => {
            event.preventDefault()
            logout.mutate()
          }}
        >
          <LogOut />
          {m.auth_logout()}
        </CtDropdownMenuItem>
      </CtDropdownMenuContent>
    </CtDropdownMenu>
  )
}
