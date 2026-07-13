import { Suspense } from 'react'
import { Outlet } from '@tanstack/react-router'
import { CtFooter } from '@/modules/app/components/layout/CtFooter'
import { CtHeader } from '@/modules/app/components/layout/CtHeader'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'

export default function CtPanelLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <CtHeader />
      <main className="flex-1">
        <Suspense fallback={<CtLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <CtFooter />
    </div>
  )
}
