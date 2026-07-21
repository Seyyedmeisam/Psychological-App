import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { getAuthToken } from '@/modules/auth/constants/auth'
import {
  CtProfileGuest,
  CtProfileSummary,
} from '@/modules/auth/components/CtProfileSummary'
import { useMe } from '@/modules/auth/hooks'

export default function ProfilePage() {
  const hasToken = Boolean(getAuthToken())
  const { data: user, isLoading, isError, error } = useMe({ enabled: hasToken })

  return (
    <section className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(110%_70%_at_0%_0%,oklch(0.92_0.04_252),transparent_55%),radial-gradient(80%_60%_at_100%_20%,oklch(0.93_0.03_200),transparent_50%),var(--background)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-s-20 top-10 -z-10 size-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-e-16 bottom-0 -z-10 size-72 rounded-full bg-[oklch(0.78_0.06_195/0.28)] blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
       

        {!hasToken ? (
          <CtProfileGuest />
        ) : (
          <CtAsyncContent
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
          >
            {user ? <CtProfileSummary user={user} /> : null}
          </CtAsyncContent>
        )}
      </div>
    </section>
  )
}
