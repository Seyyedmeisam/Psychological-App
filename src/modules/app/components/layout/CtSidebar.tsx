import { Link } from '@tanstack/react-router'
import { Info, PanelLeft, User, Users } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'

const navItems = [
  { to: '/profile' as const, label: () => m.nav_profile(), icon: User },
  { to: '/users' as const, label: () => m.nav_users(), icon: Users },
  { to: '/about' as const, label: () => m.nav_about(), icon: Info },
] as const

export function CtSidebar({ variant }: Readonly<{ variant: 'desktop' | 'mobile' }>) {
  const { isCollapsed } = useSidebar()

  const collapsed = variant === 'desktop' && isCollapsed

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-e border-border bg-card',
        collapsed ? 'w-20' : 'w-72',
      )}
      aria-label="Sidebar"
    >
      <div className={cn('flex items-center gap-2 border-b border-border px-4 py-4', collapsed && 'justify-center px-2')}>
        <PanelLeft className="size-5 text-muted-foreground" />
        {collapsed ? null : (
          <span className="text-sm font-semibold text-foreground">{m.app_name()}</span>
        )}
      </div>

      <nav className={cn('flex flex-1 flex-col gap-1 p-2', collapsed && 'items-center')}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground [&.active]:bg-accent [&.active]:text-accent-foreground',
                collapsed && 'w-12 justify-center px-0',
              )}
              aria-label={collapsed ? item.label() : undefined}
            >
              <Icon className="size-4" />
              {collapsed ? null : <span className="truncate">{item.label()}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

