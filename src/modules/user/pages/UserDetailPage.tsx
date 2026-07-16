import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardAction,
  CtCardContent,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { useDeleteUser, useUser } from '@/modules/user/hooks'
import type { UserRole } from '@/modules/user/types'

function formatRole(role: UserRole) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

function formatMemberSince(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(getLocale(), { dateStyle: 'medium' }).format(new Date(value))
}

export default function UserDetailPage() {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const id = Number(params.userId)
  const { data, isLoading, isError, error } = useUser(id)
  const deleteUser = useDeleteUser({
    onSuccess: async () => {
      await navigate({ to: '/users' })
    },
  })

  const handleDelete = () => {
    if (window.confirm(m.user_delete_confirm())) {
      deleteUser.mutate(id)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {data ? (
          <CtCard>
            <CtCardHeader>
              <CtCardTitle>{data.name}</CtCardTitle>
              <CtCardAction>
                <div className="flex flex-wrap gap-2">
                  <CtButton asChild variant="outline" size="sm">
                    <Link to="/users/upsert/$userId" params={{ userId: String(id) }}>
                      {m.user_edit()}
                    </Link>
                  </CtButton>
                  <CtButton
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteUser.isPending}
                  >
                    {m.user_delete()}
                  </CtButton>
                  <CtButton asChild variant="ghost" size="sm">
                    <Link to="/users">{m.nav_users()}</Link>
                  </CtButton>
                </div>
              </CtCardAction>
            </CtCardHeader>
            <CtCardContent>
              <dl className="grid gap-4 text-sm">
                <div className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-medium text-muted-foreground">{m.auth_mobile_label()}</dt>
                  <dd>{data.mobile}</dd>
                </div>
                <div className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-medium text-muted-foreground">{m.user_email_label()}</dt>
                  <dd>{data.email || '—'}</dd>
                </div>
                <div className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-medium text-muted-foreground">{m.auth_profile_role()}</dt>
                  <dd>{formatRole(data.role)}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">
                    {m.auth_profile_member_since()}
                  </dt>
                  <dd>{formatMemberSince(data.created_at)}</dd>
                </div>
              </dl>
            </CtCardContent>
          </CtCard>
        ) : null}
      </CtAsyncContent>
    </section>
  )
}
