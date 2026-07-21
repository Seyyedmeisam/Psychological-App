import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CtListRowProps = {
  leading?: ReactNode
  className?: string
  title?: string
  subtitle?: string
  accessory?: ReactNode
  showChevron?: boolean
  onClick?: () => void
}

/** iOS-style list row inside {@link CtGroup}. */
export function CtListRow({
  leading,
  className,
  title,
  subtitle,
  accessory,
  showChevron = false,
  onClick,
}: CtListRowProps) {
  const Comp = onClick ? 'button' : 'div'

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      data-slot="ct-list-row"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors duration-150',
        onClick && 'ios-press hover:bg-muted/40',
        className,
      )}
    >
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {accessory ? <div className="shrink-0 text-sm text-muted-foreground">{accessory}</div> : null}
      {showChevron ? (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
      ) : null}
    </Comp>
  )
}
