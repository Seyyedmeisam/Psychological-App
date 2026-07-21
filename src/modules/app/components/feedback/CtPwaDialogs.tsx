import { Download, RefreshCw } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtDialogContent,
  CtDialogDescription,
  CtDialogRoot,
  CtDialogTitle,
} from '@/modules/app/components/CtDialogParts'
import { cn } from '@/lib/utils'

type CtPwaDialogShellProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  icon: 'install' | 'update'
  title: string
  description: string
  primaryLabel: string
  secondaryLabel: string
  onPrimary: () => void | Promise<void>
  onSecondary: () => void
  primaryPending?: boolean
}>

function CtPwaDialogShell({
  open,
  onOpenChange,
  icon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryPending = false,
}: CtPwaDialogShellProps) {
  const Icon = icon === 'install' ? Download : RefreshCw

  return (
    <CtDialogRoot open={open} onOpenChange={onOpenChange}>
      <CtDialogContent className="max-w-[calc(100%-2rem)] gap-5 rounded-2xl p-5 sm:max-w-md sm:p-6 ios-slide-up">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl',
              icon === 'install'
                ? 'bg-primary/10 text-primary'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1.5">
            <CtDialogTitle>{title}</CtDialogTitle>
            <CtDialogDescription>{description}</CtDialogDescription>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <CtButton type="button" variant="ghost" onClick={onSecondary}>
            {secondaryLabel}
          </CtButton>
          <CtButton
            type="button"
            disabled={primaryPending}
            onClick={() => {
              void onPrimary()
            }}
          >
            {primaryPending ? (
              <RefreshCw className="me-2 size-4 animate-spin" aria-hidden />
            ) : null}
            {primaryLabel}
          </CtButton>
        </div>
      </CtDialogContent>
    </CtDialogRoot>
  )
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const INSTALL_DISMISS_KEY = 'pwa-install-dismissed'

export function CtPwaInstallDialog({
  deferred,
  open,
  onOpenChange,
  onConsumed,
}: Readonly<{
  deferred: BeforeInstallPromptEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConsumed: () => void
}>) {
  return (
    <CtPwaDialogShell
      open={open && Boolean(deferred)}
      onOpenChange={onOpenChange}
      icon="install"
      title={m.pwa_install_title()}
      description={m.pwa_install_description()}
      primaryLabel={m.pwa_install_action()}
      secondaryLabel={m.pwa_install_dismiss()}
      onPrimary={async () => {
        if (!deferred) return
        await deferred.prompt()
        const choice = await deferred.userChoice
        onConsumed()
        onOpenChange(false)
        if (choice.outcome === 'dismissed') {
          localStorage.setItem(INSTALL_DISMISS_KEY, '1')
        }
      }}
      onSecondary={() => {
        localStorage.setItem(INSTALL_DISMISS_KEY, '1')
        onOpenChange(false)
        onConsumed()
      }}
    />
  )
}

export function CtPwaUpdateDialog({
  open,
  onOpenChange,
  onUpdate,
  updating,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void | Promise<void>
  updating: boolean
}>) {
  return (
    <CtPwaDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon="update"
      title={m.pwa_update_title()}
      description={m.pwa_update_description()}
      primaryLabel={m.pwa_update_action()}
      secondaryLabel={m.pwa_update_dismiss()}
      primaryPending={updating}
      onPrimary={onUpdate}
      onSecondary={() => onOpenChange(false)}
    />
  )
}

export { INSTALL_DISMISS_KEY }
export type { BeforeInstallPromptEvent }
