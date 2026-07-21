import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'
import type { BeforeInstallPromptEvent } from '@/modules/app/components/feedback/CtPwaDialogs'
import {
  CtPwaInstallDialog,
  CtPwaUpdateDialog,
  INSTALL_DISMISS_KEY,
} from '@/modules/app/components/feedback/CtPwaDialogs'

/**
 * Registers the service worker and shows install / update dialogs.
 */
export function CtPwaRegistrar() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [installOpen, setInstallOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const updateSWRef = useRef<
    ((reloadPage?: boolean) => Promise<void>) | undefined
  >(undefined)
  const updateCheckIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setUpdateOpen(true)
      },
      onRegisteredSW(swUrl, registration) {
        if (import.meta.env.DEV) {
          console.info('[pwa] service worker registered', swUrl)
        }

        if (!registration) return

        if (updateCheckIdRef.current !== null) {
          window.clearInterval(updateCheckIdRef.current)
        }

        updateCheckIdRef.current = window.setInterval(() => {
          void registration.update()
        }, 60 * 60 * 1000)
      },
      onRegisterError(error) {
        console.warn('[pwa] service worker registration failed', error)
      },
    })

    return () => {
      if (updateCheckIdRef.current !== null) {
        window.clearInterval(updateCheckIdRef.current)
        updateCheckIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem(INSTALL_DISMISS_KEY) === '1') return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setInstallOpen(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () =>
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  return (
    <>
      <CtPwaInstallDialog
        deferred={installPrompt}
        open={installOpen}
        onOpenChange={setInstallOpen}
        onConsumed={() => setInstallPrompt(null)}
      />
      <CtPwaUpdateDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        updating={updating}
        onUpdate={async () => {
          setUpdating(true)
          try {
            await updateSWRef.current?.(true)
          } finally {
            setUpdating(false)
            setUpdateOpen(false)
          }
        }}
      />
    </>
  )
}
