import { Suspense } from 'react'
import { Outlet } from '@tanstack/react-router'
import { CtFooter } from '@/modules/app/components/layout/CtFooter'
import { CtPublicHeader } from '@/modules/app/components/layout/CtPublicHeader'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'

export default function CtPublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <CtPublicHeader />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<CtLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <CtFooter />
    </div>
  )
}
