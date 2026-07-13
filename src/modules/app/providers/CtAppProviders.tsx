import type { ReactNode } from 'react'
import { CtPwaRegistrar } from '@/modules/app/components/feedback/CtPwaRegistrar'
import { CtI18nProvider } from '@/modules/app/providers/CtI18nProvider'
import { CtQueryProvider } from '@/modules/app/providers/CtQueryProvider'
import { CtToastProvider } from '@/modules/app/providers/CtToastProvider'

export function CtAppProviders({ children }: { children: ReactNode }) {
  return (
    <CtI18nProvider>
      <CtQueryProvider>
        <CtToastProvider>
          <CtPwaRegistrar />
          {children}
        </CtToastProvider>
      </CtQueryProvider>
    </CtI18nProvider>
  )
}
