import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { getAuthToken } from '@/modules/auth/constants/auth'
import { CtProfileGuest, CtProfileSummary } from '@/modules/auth/components/CtProfileSummary'
import { useMe } from '@/modules/auth/hooks'

export default function ProfilePage() {
  const hasToken = Boolean(getAuthToken())
  const { data: user, isLoading, isError, error } = useMe({ enabled: hasToken })

  if (!hasToken) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          {m.auth_profile_title()}
        </h1>
        <CtProfileGuest />
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        {m.auth_profile_title()}
      </h1>
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {user ? <CtProfileSummary user={user} /> : null}
      </CtAsyncContent>
    </section>
  )
}
