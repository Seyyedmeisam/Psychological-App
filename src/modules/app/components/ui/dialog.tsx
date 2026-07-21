import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  /**
   * When open, push a history entry so the browser/Android back button
   * closes this dialog instead of leaving the page. Default: true.
   */
  historyBack?: boolean
}

function Dialog({
  open,
  onOpenChange,
  historyBack = true,
  ...props
}: Readonly<DialogProps>) {
  const dialogId = React.useId()
  const pushedRef = React.useRef(false)
  const closingViaBackRef = React.useRef(false)

  React.useEffect(() => {
    if (!historyBack || open !== true) return

    const previous =
      typeof history.state === 'object' && history.state !== null
        ? (history.state as Record<string, unknown>)
        : {}

    if (previous.ctDialog !== dialogId) {
      history.pushState({ ...previous, ctDialog: dialogId }, '')
    }
    pushedRef.current = true

    const onPopState = () => {
      if (!pushedRef.current) return
      pushedRef.current = false
      closingViaBackRef.current = true
      onOpenChange?.(false)
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [dialogId, historyBack, onOpenChange, open])

  React.useEffect(() => {
    if (open === true || !pushedRef.current) return

    if (closingViaBackRef.current) {
      closingViaBackRef.current = false
      return
    }

    pushedRef.current = false
    history.back()
  }, [open])

  const handleOpenChange = (next: boolean) => {
    if (!next && historyBack && pushedRef.current) {
      history.back()
      return
    }
    onOpenChange?.(next)
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={historyBack ? handleOpenChange : onOpenChange}
      {...props}
    />
  )
}

function DialogTrigger(props: Readonly<React.ComponentProps<typeof DialogPrimitive.Trigger>>) {
  return <DialogPrimitive.Trigger {...props} />
}

function DialogPortal(props: Readonly<React.ComponentProps<typeof DialogPrimitive.Portal>>) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogClose(props: Readonly<React.ComponentProps<typeof DialogPrimitive.Close>>) {
  return <DialogPrimitive.Close {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Default `center`. Use `drawer-start` for edge drawers (e.g. mobile sidebar). */
  placement?: 'center' | 'drawer-start'
}

function DialogContent({
  className,
  placement = 'center',
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 grid gap-4 border border-border bg-card shadow-ios-md outline-none',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
          placement === 'center' &&
            'inset-0 m-auto h-fit w-[calc(100%-2rem)] max-h-[min(90dvh,52rem)] max-w-lg overflow-y-auto rounded-3xl p-6',
          placement === 'drawer-start' &&
            'inset-y-0 inset-s-0 m-0 h-dvh w-full max-w-[90vw] overflow-hidden rounded-none border-0 p-0 duration-(--motion-duration-slow) data-[state=closed]:slide-out-to-left-2 data-[state=open]:slide-in-from-left-2 sm:max-w-sm',
          className,
        )}
        {...props}
      />
    </DialogPortal>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
}
export type { DialogProps, DialogContentProps }
