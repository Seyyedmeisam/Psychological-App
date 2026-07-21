import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CtDialogContent,
  CtDialogDescription,
  CtDialogRoot,
  CtDialogTitle,
} from '@/modules/app/components/CtDialogParts'
import { CtButton } from '@/modules/app/components/CtButton'

type CtModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  /**
   * Sync browser back button with close via the base Dialog.
   * Default true.
   */
  historyBack?: boolean
}

/**
 * App modal built on CtDialog — centered and back-button aware by default.
 */
export function CtModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  historyBack = true,
}: Readonly<CtModalProps>) {
  return (
    <CtDialogRoot open={open} onOpenChange={onOpenChange} historyBack={historyBack}>
      <CtDialogContent
        className={cn('sm:max-w-lg', className)}
        aria-describedby={description ? undefined : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CtDialogTitle>{title}</CtDialogTitle>
            {description ? (
              <CtDialogDescription>{description}</CtDialogDescription>
            ) : null}
          </div>
          <CtButton
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </CtButton>
        </div>

        <div className="mt-2">{children}</div>
        {footer ? (
          <div className="mt-4 flex flex-wrap justify-end gap-2">{footer}</div>
        ) : null}
      </CtDialogContent>
    </CtDialogRoot>
  )
}
