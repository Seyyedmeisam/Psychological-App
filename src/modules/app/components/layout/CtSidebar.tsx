import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'
import { useLogout, useMe } from '@/modules/auth/hooks'
import type { UserRole } from '@/modules/auth/types'
import { isApprovedMentor } from '@/modules/auth/utils/routeGuards'

type NavItem = {
  to:
    | '/dashboard'
    | '/home'
    | '/mentor'
    | '/users'
    | '/mentor-verifications'
    | '/schedule'
    | '/appointments'
    | '/appointments/book'
    | '/appointments/expertise'
    | '/chats'
    | '/profile'
  label: () => string
  icon: typeof Home
  roles?: UserRole[]
  /** Extra visibility gate beyond role */
  when?: (ctx: { role: UserRole | undefined; approvedMentor: boolean }) => boolean
}

type NavGroup = {
  id: string
  label: () => string
  roles?: UserRole[]
  items: NavItem[]
}

const topNavItems: NavItem[] = [
  {
    to: '/dashboard',
    label: () => m.nav_dashboard(),
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    to: '/home',
    label: () => m.nav_home(),
    icon: Home,
    roles: ['user'],
  },
  {
    to: '/mentor',
    label: () => m.nav_mentor_home(),
    icon: Home,
    roles: ['mentor'],
  },
  {
    to: '/users',
    label: () => m.nav_users(),
    icon: Users,
    roles: ['admin'],
  },
  {
    to: '/mentor-verifications',
    label: () => m.nav_mentor_verifications(),
    icon: ShieldCheck,
    roles: ['admin'],
  },
  {
    to: '/schedule',
    label: () => m.nav_schedule(),
    icon: CalendarDays,
    roles: ['mentor'],
    when: ({ approvedMentor }) => approvedMentor,
  },
  {
    to: '/appointments/expertise',
    label: () => m.nav_expertise(),
    icon: Sparkles,
    roles: ['mentor'],
  },
  {
    to: '/chats',
    label: () => m.nav_chats(),
    icon: MessageCircle,
    roles: ['user', 'mentor', 'admin'],
  },
]

const appointmentGroup: NavGroup = {
  id: 'appointments',
  label: () => m.nav_appointments_group(),
  roles: ['user', 'mentor', 'admin'],
  items: [
    {
      to: '/appointments/book',
      label: () => m.nav_book_appointment(),
      icon: CalendarPlus,
      roles: ['user'],
    },
    {
      to: '/appointments',
      label: () => m.nav_my_appointments(),
      icon: CalendarCheck2,
      roles: ['user', 'mentor', 'admin'],
    },
  ],
}

const profileItem: NavItem = {
  to: '/profile',
  label: () => m.nav_profile(),
  icon: User,
}

function isVisible(
  item: { roles?: UserRole[]; when?: NavItem['when'] },
  role: UserRole | undefined,
  approvedMentor: boolean,
) {
  if (item.roles) {
    if (!role) return false
    if (!item.roles.includes(role)) return false
  }
  if (item.when && !item.when({ role, approvedMentor })) return false
  return true
}

function NavLink({
  item,
  collapsed,
  index,
  onNavigate,
  className,
}: Readonly<{
  item: NavItem
  collapsed: boolean
  index: number
  onNavigate: () => void
  className?: string
}>) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      style={{ animationDelay: `${index * 45}ms` }}
      className={cn(
        'ios-press ios-sidebar-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-(--motion-duration-fast) hover:bg-muted/60 hover:text-foreground [&.active]:bg-accent [&.active]:text-accent-foreground',
        collapsed && 'w-12 justify-center gap-0 px-0',
        className,
      )}
      aria-label={collapsed ? item.label() : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span
        className={cn(
          'truncate transition-[opacity,max-width] duration-(--motion-duration-normal) ease-(--motion-ease-out)',
          collapsed ? 'max-w-0 opacity-0' : 'max-w-36 opacity-100',
        )}
      >
        {item.label()}
      </span>
    </Link>
  )
}

export function CtSidebar({ variant }: Readonly<{ variant: 'desktop' | 'mobile' }>) {
  const { isCollapsed, setMobileOpen } = useSidebar()
  const { data: user } = useMe()
  const logout = useLogout()
  const collapsed = variant === 'desktop' && isCollapsed
  const role = user?.role
  const approvedMentor = isApprovedMentor(user)

  const visibleTop = topNavItems.filter((item) =>
    isVisible(item, role, approvedMentor),
  )
  const visibleGroupItems = appointmentGroup.items.filter((item) =>
    isVisible(item, role, approvedMentor),
  )
  const showGroup =
    isVisible(appointmentGroup, role, approvedMentor) &&
    visibleGroupItems.length > 0

  const onNavigate = () => {
    if (variant === 'mobile') setMobileOpen(false)
  }

  const onLogout = () => {
    onNavigate()
    logout.mutate()
  }

  let index = 0

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 flex-col border-e border-border bg-card transition-[width] duration-(--motion-duration-slow) ease-(--motion-ease-out)',
        collapsed ? 'w-16' : 'w-56',
      )}
      aria-label="Sidebar"
    >
      <nav
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-2',
          collapsed && 'items-center',
        )}
      >
        {visibleTop.map((item) => {
          const current = index++
          return (
            <NavLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              index={current}
              onNavigate={onNavigate}
            />
          )
        })}

        {showGroup ? (
          <div className={cn('mt-2 flex flex-col gap-1', collapsed && 'items-center')}>
            {!collapsed ? (
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {appointmentGroup.label()}
              </p>
            ) : (
              <div className="my-1 h-px w-8 bg-border" aria-hidden />
            )}
            {visibleGroupItems.map((item) => {
              const current = index++
              return (
                <NavLink
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  index={current}
                  onNavigate={onNavigate}
                />
              )
            })}
          </div>
        ) : null}
      </nav>

      <div
        className={cn(
          'shrink-0 border-t border-border bg-card p-2',
          collapsed && 'flex flex-col items-center',
        )}
      >
        <NavLink
          item={profileItem}
          collapsed={collapsed}
          index={index++}
          onNavigate={onNavigate}
        />
        <button
          type="button"
          onClick={onLogout}
          disabled={logout.isPending}
          aria-label={m.auth_logout()}
          className={cn(
            'ios-press mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors duration-(--motion-duration-fast) hover:bg-destructive/10 disabled:opacity-45',
            collapsed && 'w-12 justify-center gap-0 px-0',
          )}
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          <span
            className={cn(
              'truncate transition-[opacity,max-width] duration-(--motion-duration-normal) ease-(--motion-ease-out)',
              collapsed ? 'max-w-0 opacity-0' : 'max-w-36 opacity-100',
            )}
          >
            {m.auth_logout()}
          </span>
        </button>
      </div>
    </aside>
  )
}
