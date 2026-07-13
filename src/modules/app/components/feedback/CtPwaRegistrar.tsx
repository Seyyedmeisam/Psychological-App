import { useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function CtPwaRegistrar() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      registerSW({ immediate: true })
      return
    }

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return null
}
