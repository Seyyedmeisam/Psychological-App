import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

export function CtToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <Toaster
        richColors
        position="top-center"
        closeButton
        toastOptions={{
          classNames: {
            toast: 'font-sans',
          },
        }}
      />
    </>
  )
}

