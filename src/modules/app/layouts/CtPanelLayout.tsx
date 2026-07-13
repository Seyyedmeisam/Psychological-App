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
      <div className="flex min-h-screen flex-col">
        <CtHeader />
        <div className="flex flex-1">
          <div className="hidden lg:block">
            <CtSidebar variant="desktop" />
          </div>
          <main className="min-w-0 flex-1">
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
