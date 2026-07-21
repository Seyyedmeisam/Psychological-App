import { lazy, Suspense } from 'react'

const LazyDevtools = lazy(async () => {
  const [{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }] =
    await Promise.all([
      import('@tanstack/react-devtools'),
      import('@tanstack/react-router-devtools'),
    ])

  return {
    default: function CtTanStackDevtoolsHost() {
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
    },
  }
})

/** Opt-in only: `VITE_TANSTACK_DEVTOOLS=1 bun run dev` */
export function CtTanStackDevtools() {
  if (import.meta.env.VITE_TANSTACK_DEVTOOLS !== '1') return null

  return (
    <Suspense fallback={null}>
      <LazyDevtools />
    </Suspense>
  )
}
