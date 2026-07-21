import { Suspense } from 'react'
import { Outlet } from '@tanstack/react-router'
import { CtFooter } from '@/modules/app/components/layout/CtFooter'
import { CtHeader } from '@/modules/app/components/layout/CtHeader'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'
import { CtSidebar } from '@/modules/app/components/layout/CtSidebar'
import { CtSidebarDrawer } from '@/modules/app/components/layout/CtSidebarDrawer'
import { CtSidebarProvider } from '@/modules/app/providers/CtSidebarProvider'

export default function CtPanelLayout() {
  return (
    <CtSidebarProvider>
      <div
        className="flex min-h-dvh flex-col"
        style={{ ['--app-header-height' as string]: '4.75rem' }}
      >
        <CtHeader />
        <div className="flex min-h-0 flex-1">
          <div className="sticky top-[var(--app-header-height,4.75rem)] z-30 hidden h-[calc(100dvh-var(--app-header-height,4.75rem))] shrink-0 lg:block">
            <CtSidebar variant="desktop" />
          </div>
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <Suspense fallback={<CtLoading />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
        <CtFooter />
        <CtSidebarDrawer />
      </div>
    </CtSidebarProvider>
  )
}
