import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CtGroupProps = {
  children: ReactNode
  className?: string
}

/** iOS-style grouped container (Settings list background). */
export function CtGroup({ children, className }: CtGroupProps) {
  return (
    <div data-slot="ct-group" className={cn('ios-group divide-y divide-border', className)}>
      {children}
    </div>
  )
}
