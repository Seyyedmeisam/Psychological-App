import type { ReactNode } from 'react'
import {
  CtAlert,
  CtAlertDescription,
} from '@/modules/app/components/CtAlert'
import { cn } from '@/lib/utils'

type CtPageIntroProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/** Page title + optional subtitle styled as a shadcn alert (description only). */
export function CtPageIntro({
  title,
  description,
  action,
  className,
}: Readonly<CtPageIntroProps>) {
  return (
    <div className={cn('mb-6 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {action}
      </div>
      {description ? (
        <CtAlert>
          <CtAlertDescription>{description}</CtAlertDescription>
        </CtAlert>
      ) : null}
    </div>
  )
}
