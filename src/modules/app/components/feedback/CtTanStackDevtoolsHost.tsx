import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

/** Loaded only in development when VITE_TANSTACK_DEVTOOLS=1. */
export function CtTanStackDevtoolsHost() {
  return (
    <TanStackDevtools
      config={{ position: 'bottom-right' }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  )
}
