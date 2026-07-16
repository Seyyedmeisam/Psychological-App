import { Link } from '@tanstack/react-router'
import { CalendarDays, Home, Info, LayoutDashboard, PanelLeft, User, Users } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'
import { useMe } from '@/modules/auth/hooks'
import type { UserRole } from '@/modules/auth/types'

type NavItem = {
  to: '/dashboard' | '/home' | '/mentor' | '/users' | '/schedule' | '/profile' | '/about'
  label: () => string
  icon: typeof Home
  roles?: UserRole[]
}

const navItems: NavItem[] = [
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
  { to: '/profile', label: () => m.nav_profile(), icon: User },
  { to: '/about', label: () => m.nav_about(), icon: Info },
]

export function CtSidebar({ variant }: Readonly<{ variant: 'desktop' | 'mobile' }>) {
  const { isCollapsed, setMobileOpen } = useSidebar()
  const { data: user } = useMe()
  const collapsed = variant === 'desktop' && isCollapsed

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-e border-border bg-card transition-[width] duration-(--motion-duration-slow) ease-(--motion-ease-out)',
        collapsed ? 'w-20' : 'w-72',
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
            collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
          )}
        >
          {m.app_name()}
        </span>
      </div>

      <nav className={cn('flex flex-1 flex-col gap-1 p-2', collapsed && 'items-center')}>
        {visibleItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                if (variant === 'mobile') setMobileOpen(false)
              }}
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
                  collapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100',
                )}
              >
                {item.label()}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
