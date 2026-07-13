import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtTable,
  CtTableBody,
  CtTableCell,
  CtTableHead,
  CtTableHeader,
  CtTableRow,
} from '@/modules/app/components/widgets/table/CtTable'
import { useUsers } from '@/modules/user/hooks'
import type { UserRole } from '@/modules/user/types'

function formatRole(role: UserRole) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

export default function UsersListPage() {
  const { data, isLoading, isError, error } = useUsers()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 ios-slide-up">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{m.users_title()}</h1>
        <CtButton asChild>
          <Link to="/users/upsert">{m.users_add()}</Link>
        </CtButton>
      </div>
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {(data ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            {m.users_empty()}
          </p>
        ) : (
          <CtTable>
            <CtTableHeader>
              <CtTableRow>
                <CtTableHead>{m.auth_name_label()}</CtTableHead>
                <CtTableHead>{m.auth_mobile_label()}</CtTableHead>
                <CtTableHead>{m.auth_profile_role()}</CtTableHead>
                <CtTableHead className="w-28 text-end">
                  <span className="sr-only">{m.users_view()}</span>
                </CtTableHead>
              </CtTableRow>
            </CtTableHeader>
            <CtTableBody>
              {(data ?? []).map((user) => (
                <CtTableRow key={user.id}>
                  <CtTableCell className="font-medium">{user.name}</CtTableCell>
                  <CtTableCell className="text-muted-foreground">{user.mobile}</CtTableCell>
                  <CtTableCell className="text-muted-foreground">{formatRole(user.role)}</CtTableCell>
                  <CtTableCell className="text-end">
                    <CtButton asChild variant="tinted" size="sm">
                      <Link to="/users/$userId" params={{ userId: String(user.id) }}>
                        {m.users_view()}
                      </Link>
                    </CtButton>
                  </CtTableCell>
                </CtTableRow>
              ))}
            </CtTableBody>
          </CtTable>
        )}
      </CtAsyncContent>
    </section>
  )
}
