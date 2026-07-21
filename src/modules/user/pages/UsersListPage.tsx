import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtInput } from '@/modules/app/components/CtInput'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import {
  CtTable,
  CtTableBody,
  CtTableCell,
  CtTableHead,
  CtTableHeader,
  CtTableRow,
} from '@/modules/app/components/widgets/table/CtTable'
import { useUsers } from '@/modules/user/hooks'
import type { UserRole, UsersListParams } from '@/modules/user/types'

function formatRole(role: UserRole) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

export default function UsersListPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState<'all' | UserRole>('all')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const params: UsersListParams = {}
  if (debouncedSearch) params.search = debouncedSearch
  if (role !== 'all') params.role = role

  const { data, isLoading, isError, error, isFetching } = useUsers(params)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        title={m.users_title()}
        action={
          <CtButton asChild>
            <Link to="/users/upsert">{m.users_add()}</Link>
          </CtButton>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <CtInput
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={m.users_search_placeholder()}
          aria-label={m.users_search_placeholder()}
          className="sm:max-w-sm"
        />
        <CtSelectRoot
          value={role}
          onValueChange={(value) => setRole(value as 'all' | UserRole)}
        >
          <CtSelectTrigger className="w-full sm:w-48" aria-label={m.users_filter_role()}>
            <CtSelectValue placeholder={m.users_filter_role()} />
          </CtSelectTrigger>
          <CtSelectContent>
            <CtSelectItem value="all">{m.users_filter_all_roles()}</CtSelectItem>
            <CtSelectItem value="user">{m.auth_role_user()}</CtSelectItem>
            <CtSelectItem value="mentor">{m.auth_role_mentor()}</CtSelectItem>
            <CtSelectItem value="admin">{m.auth_role_admin()}</CtSelectItem>
          </CtSelectContent>
        </CtSelectRoot>
        {isFetching && !isLoading ? (
          <span className="text-sm text-muted-foreground">{m.users_filtering()}</span>
        ) : null}
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
