import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CtSurfaceProps = {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function CtSurface({ children, className, title, description }: CtSurfaceProps) {
  return (
    <section className={cn('ios-slide-up', className)}>
      {title ? (
        <header className="mb-2 px-1">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
