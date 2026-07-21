import { FormProvider } from 'react-hook-form'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtSelect, CtTextInput } from '@/modules/app/components/forms'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { CtModal } from '@/modules/app/components/widgets/modal/CtModal'
import { CtUserAvatarEditor } from '@/modules/user/components/CtUserAvatarEditor'
import {
  useDeleteUser,
  useUpdateUserAvatar,
  useUser,
  useUserUpsertForm,
} from '@/modules/user/hooks'
import type { User, UserRole } from '@/modules/user/types'

function formatRole(role: UserRole) {
  if (role === 'admin') return m.auth_role_admin()
  if (role === 'mentor') return m.auth_role_mentor()
  return m.auth_role_user()
}

function formatMemberSince(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(getLocale(), { dateStyle: 'medium' }).format(
    new Date(value),
  )
}

type Mode = 'view' | 'edit'

type CtUserProfileModalProps = {
  userId: number | null
  open: boolean
  mode: Mode
  onModeChange: (mode: Mode) => void
  onOpenChange: (open: boolean) => void
}

export function CtUserProfileModal({
  userId,
  open,
  mode,
  onModeChange,
  onOpenChange,
}: Readonly<CtUserProfileModalProps>) {
  const id = userId ?? 0
  const { data, isLoading, isError, error } = useUser(id, {
    enabled: open && id > 0,
  })
  const { form, save, isPending } = useUserUpsertForm(
    open && mode === 'edit' && id > 0 ? id : undefined,
  )
  const updateAvatar = useUpdateUserAvatar(id)
  const deleteUser = useDeleteUser({
    onSuccess: async () => {
      onOpenChange(false)
    },
  })

  const handleDelete = () => {
    if (!id) return
    if (window.confirm(m.user_delete_confirm())) {
      deleteUser.mutate(id)
    }
  }

  const onAvatarSelect = (file: File) => {
    if (!id) return
    updateAvatar.mutate(file)
  }

  return (
    <CtModal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === 'edit'
          ? m.user_edit()
          : (data?.name ?? m.users_view())
      }
      description={
        mode === 'view' && data ? formatRole(data.role) : m.users_profile_modal_hint()
      }
      className="max-w-xl"
      footer={
        mode === 'view' && data ? (
          <>
            <CtButton
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              {m.user_delete()}
            </CtButton>
            <CtButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onModeChange('edit')}
            >
              {m.user_edit()}
            </CtButton>
          </>
        ) : mode === 'edit' ? (
          <>
            <CtButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onModeChange('view')}
              disabled={isPending}
            >
              {m.user_cancel()}
            </CtButton>
            <CtButton
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                save(() => {
                  onModeChange('view')
                })
              }
            >
              {isPending ? <CtSpinner className="size-4" /> : null}
              {m.user_save()}
            </CtButton>
          </>
        ) : null
      }
    >
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {mode === 'view' && data ? (
          <UserProfileView
            user={data}
            avatarPending={updateAvatar.isPending}
            onAvatarSelect={onAvatarSelect}
          />
        ) : null}
        {mode === 'edit' && data ? (
          <FormProvider {...form}>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                save(() => onModeChange('view'))
              }}
            >
              <div className="sm:col-span-2">
                <CtUserAvatarEditor
                  name={data.name}
                  seed={data.id}
                  src={data.avatar_url}
                  size="lg"
                  isPending={updateAvatar.isPending}
                  onSelect={onAvatarSelect}
                />
              </div>
              <CtTextInput
                name="name"
                label={m.auth_name_label()}
                rules={{ required: m.auth_name_required() }}
              />
              <CtTextInput
                name="mobile"
                label={m.auth_mobile_label()}
                rules={{ required: m.auth_mobile_required() }}
                inputMode="tel"
                autoComplete="tel"
              />
              <CtTextInput
                name="email"
                label={m.user_email_label()}
                type="email"
                autoComplete="email"
              />
              <CtSelect
                name="role"
                label={m.auth_role_label()}
                options={[
                  { value: 'user', label: m.auth_role_user() },
                  { value: 'mentor', label: m.auth_role_mentor() },
                  { value: 'admin', label: m.auth_role_admin() },
                ]}
              />
              <div className="sm:col-span-2">
                <CtTextInput
                  name="password"
                  label={m.user_password_optional()}
                  type="password"
                  rules={{
                    minLength: { value: 8, message: m.auth_password_min() },
                  }}
                  autoComplete="new-password"
                />
              </div>
              <div className="sm:col-span-2">
                <CtTextInput
                  name="password_confirmation"
                  label={m.auth_password_confirm_label()}
                  type="password"
                  autoComplete="new-password"
                />
              </div>
            </form>
          </FormProvider>
        ) : null}
      </CtAsyncContent>
    </CtModal>
  )
}

function UserProfileView({
  user,
  avatarPending,
  onAvatarSelect,
}: Readonly<{
  user: User
  avatarPending: boolean
  onAvatarSelect: (file: File) => void
}>) {
  return (
    <div className="space-y-5">
      <CtUserAvatarEditor
        name={user.name}
        seed={user.id}
        src={user.avatar_url}
        size="lg"
        isPending={avatarPending}
        onSelect={onAvatarSelect}
      />
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-muted-foreground">{formatRole(user.role)}</p>
      </div>
      <dl className="grid gap-3 text-sm">
        <div className="grid gap-1 border-b border-border pb-3">
          <dt className="font-medium text-muted-foreground">{m.auth_mobile_label()}</dt>
          <dd>{user.mobile}</dd>
        </div>
        <div className="grid gap-1 border-b border-border pb-3">
          <dt className="font-medium text-muted-foreground">{m.user_email_label()}</dt>
          <dd>{user.email || '—'}</dd>
        </div>
        <div className="grid gap-1 border-b border-border pb-3">
          <dt className="font-medium text-muted-foreground">{m.auth_profile_role()}</dt>
          <dd>{formatRole(user.role)}</dd>
        </div>
        {user.bio ? (
          <div className="grid gap-1 border-b border-border pb-3">
            <dt className="font-medium text-muted-foreground">
              {m.auth_profile_about_label()}
            </dt>
            <dd className="whitespace-pre-wrap">{user.bio}</dd>
          </div>
        ) : null}
        <div className="grid gap-1">
          <dt className="font-medium text-muted-foreground">
            {m.auth_profile_member_since()}
          </dt>
          <dd>{formatMemberSince(user.created_at)}</dd>
        </div>
      </dl>
    </div>
  )
}
