import type { ReactNode } from 'react'
import { CtI18nProvider } from '@/modules/app/providers/CtI18nProvider'
import { CtQueryProvider } from '@/modules/app/providers/CtQueryProvider'

export function CtAppProviders({ children }: { children: ReactNode }) {
  return (
    <CtI18nProvider>
      <CtQueryProvider>{children}</CtQueryProvider>
    </CtI18nProvider>
  )
}
