import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  Home,
  Info,
  LayoutDashboard,
  PanelLeft,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'
import { useMe } from '@/modules/auth/hooks'
import type { UserRole } from '@/modules/auth/types'

type NavItem = {
  to:
    | '/dashboard'
    | '/home'
    | '/mentor'
    | '/users'
    | '/schedule'
    | '/appointments'
    | '/appointments/book'
    | '/appointments/expertise'
    | '/profile'
    | '/about'
  label: () => string
  icon: typeof Home
  roles?: UserRole[]
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
    to: '/schedule',
    label: () => m.nav_schedule(),
    icon: CalendarDays,
    roles: ['mentor'],
  },
  {
    to: '/appointments/expertise',
    label: () => m.nav_expertise(),
    icon: Sparkles,
    roles: ['mentor'],
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
      roles: ['user', 'admin'],
    },
    {
      to: '/appointments',
      label: () => m.nav_my_appointments(),
      icon: CalendarCheck2,
      roles: ['user', 'mentor', 'admin'],
    },
  ],
}

const bottomNavItems: NavItem[] = [
  { to: '/profile', label: () => m.nav_profile(), icon: User },
  { to: '/about', label: () => m.nav_about(), icon: Info },
]

function isVisible(item: { roles?: UserRole[] }, role?: UserRole) {
  if (!item.roles) return true
  if (!role) return false
  return item.roles.includes(role)
}

function NavLink({
  item,
  collapsed,
  variant,
  index,
  onNavigate,
}: Readonly<{
  item: NavItem
  collapsed: boolean
  variant: 'desktop' | 'mobile'
  index: number
  onNavigate: () => void
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
  const collapsed = variant === 'desktop' && isCollapsed
  const role = user?.role

  const visibleTop = topNavItems.filter((item) => isVisible(item, role))
  const visibleGroupItems = appointmentGroup.items.filter((item) =>
    isVisible(item, role),
  )
  const showGroup =
    isVisible(appointmentGroup, role) && visibleGroupItems.length > 0
  const visibleBottom = bottomNavItems.filter((item) => isVisible(item, role))

  const onNavigate = () => {
    if (variant === 'mobile') setMobileOpen(false)
  }

  let index = 0

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-e border-border bg-card transition-[width] duration-(--motion-duration-slow) ease-(--motion-ease-out)',
        collapsed ? 'w-16' : 'w-56',
      )}
      aria-label="Sidebar"
    >
      <div
        className={cn(
          'flex items-center gap-2 overflow-hidden border-b border-border px-4 py-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <PanelLeft className="size-5 shrink-0 text-muted-foreground transition-transform duration-(--motion-duration-normal) ease-(--motion-ease-spring)" />
        <span
          className={cn(
            'overflow-hidden whitespace-nowrap text-sm font-semibold text-foreground transition-[opacity,max-width] duration-(--motion-duration-normal) ease-(--motion-ease-out)',
            collapsed ? 'max-w-0 opacity-0' : 'max-w-32 opacity-100',
          )}
        >
          {m.app_name()}
        </span>
      </div>

      <nav className={cn('flex flex-1 flex-col gap-1 p-2', collapsed && 'items-center')}>
        {visibleTop.map((item) => {
          const current = index++
          return (
            <NavLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              variant={variant}
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
                  variant={variant}
                  index={current}
                  onNavigate={onNavigate}
                />
              )
            })}
          </div>
        ) : null}

        {visibleBottom.map((item) => {
          const current = index++
          return (
            <NavLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              variant={variant}
              index={current}
              onNavigate={onNavigate}
            />
          )
        })}
      </nav>
    </aside>
  )
}
