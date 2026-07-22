import { lazy, Suspense, type ComponentType } from 'react'

function DisabledDevtools() {
  return null
}

// `import.meta.env.DEV` is replaced with `false` in production so Rollup
// drops the dynamic import and keeps @tanstack/devtools out of the SSR bundle.
const EnabledDevtools: ComponentType = import.meta.env.DEV
  ? lazy(() =>
      import('./CtTanStackDevtoolsHost').then((mod) => ({
        default: mod.CtTanStackDevtoolsHost,
      })),
    )
  : DisabledDevtools

/** Opt-in only: `VITE_TANSTACK_DEVTOOLS=1 bun run dev` (dev builds only). */
export function CtTanStackDevtools() {
  if (!import.meta.env.DEV) return null
  if (import.meta.env.VITE_TANSTACK_DEVTOOLS !== '1') return null

  return (
    <Suspense fallback={null}>
      <EnabledDevtools />
    </Suspense>
  )
}
