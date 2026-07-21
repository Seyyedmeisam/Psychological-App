import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { pagination } from '@/core/constants/pagination'
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
import { CtAvatar } from '@/modules/app/components/CtAvatar'
import {
  CtDataTable,
} from '@/modules/app/components/widgets/table/CtDataTable'
import type { CtDataTableColumn } from '@/modules/app/components/widgets/table/CtDataTable'
import { CtUserProfileModal } from '@/modules/user/components/CtUserProfileModal'
import { useUsers } from '@/modules/user/hooks'
import type { User, UserRole, UsersListParams } from '@/modules/user/types'

function formatRole(role: UserRole) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

export default function UsersListPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState<'all' | UserRole>('all')
  const [page, setPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [role])

  const params: UsersListParams = {
    page,
    per_page: pagination.defaultPerPage,
  }
  if (debouncedSearch) params.search = debouncedSearch
  if (role !== 'all') params.role = role

  const { data, isLoading, isError, error, isFetching } = useUsers(params)

  const rows = Array.isArray(data)
    ? data
    : (data?.data ?? [])
  const meta = Array.isArray(data) ? undefined : data?.meta

  const openUser = (userId: number, mode: 'view' | 'edit' = 'view') => {
    setSelectedUserId(userId)
    setModalMode(mode)
    setModalOpen(true)
  }

  const columns = useMemo<CtDataTableColumn<User>[]>(
    () => [
      {
        id: 'avatar',
        header: m.user_avatar_label(),
        className: 'w-14',
        cell: (user) => (
          <button
            type="button"
            className="ios-press rounded-full"
            onClick={() => openUser(user.id, 'view')}
            aria-label={user.name}
          >
            <CtAvatar
              name={user.name}
              seed={user.id}
              src={user.avatar_url}
              size="xs"
              className="ring-2 ring-border"
            />
          </button>
        ),
        exportValue: (user) => user.avatar_url ?? '',
      },
      {
        id: 'name',
        header: m.auth_name_label(),
        cell: (user) => <span className="font-medium">{user.name}</span>,
        exportValue: (user) => user.name,
      },
      {
        id: 'mobile',
        header: m.auth_mobile_label(),
        className: 'text-muted-foreground',
        cell: (user) => user.mobile,
        exportValue: (user) => user.mobile,
      },
      {
        id: 'email',
        header: m.user_email_label(),
        className: 'text-muted-foreground',
        cell: (user) => user.email || '—',
        exportValue: (user) => user.email ?? '',
      },
      {
        id: 'role',
        header: m.auth_profile_role(),
        className: 'text-muted-foreground',
        cell: (user) => formatRole(user.role),
        exportValue: (user) => formatRole(user.role),
      },
      {
        id: 'actions',
        header: <span className="sr-only">{m.users_view()}</span>,
        className: 'w-40 text-end',
        cell: (user) => (
          <div className="flex justify-end gap-2">
            <CtButton
              type="button"
              variant="tinted"
              size="sm"
              onClick={() => openUser(user.id, 'view')}
            >
              {m.users_view()}
            </CtButton>
            <CtButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => openUser(user.id, 'edit')}
            >
              {m.user_edit()}
            </CtButton>
          </div>
        ),
        exportValue: () => '',
      },
    ],
    [],
  )

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

      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        <CtDataTable
          columns={columns}
          rows={rows}
          rowKey={(user) => user.id}
          emptyMessage={m.users_empty()}
          isFetching={isFetching && !isLoading}
          exportFileName="users"
          exportLabel={m.users_export()}
          pagination={
            meta
              ? {
                  page: meta.current_page,
                  lastPage: meta.last_page,
                  total: meta.total,
                  perPage: meta.per_page,
                  onPageChange: setPage,
                }
              : undefined
          }
          toolbar={
            <>
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
                <CtSelectTrigger
                  className="w-full sm:w-48"
                  aria-label={m.users_filter_role()}
                >
                  <CtSelectValue placeholder={m.users_filter_role()} />
                </CtSelectTrigger>
                <CtSelectContent>
                  <CtSelectItem value="all">{m.users_filter_all_roles()}</CtSelectItem>
                  <CtSelectItem value="user">{m.auth_role_user()}</CtSelectItem>
                  <CtSelectItem value="mentor">{m.auth_role_mentor()}</CtSelectItem>
                  <CtSelectItem value="admin">{m.auth_role_admin()}</CtSelectItem>
                </CtSelectContent>
              </CtSelectRoot>
            </>
          }
        />
      </CtAsyncContent>

      <CtUserProfileModal
        userId={selectedUserId}
        open={modalOpen}
        mode={modalMode}
        onModeChange={setModalMode}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) {
            setSelectedUserId(null)
            setModalMode('view')
          }
        }}
      />
    </section>
  )
}
