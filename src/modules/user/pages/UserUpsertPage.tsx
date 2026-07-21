import { FormProvider } from 'react-hook-form'
import { Link, useParams } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtSelect, CtTextInput } from '@/modules/app/components/forms'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { CtUserAvatarEditor } from '@/modules/user/components/CtUserAvatarEditor'
import { useUpdateUserAvatar, useUser, useUserUpsertForm } from '@/modules/user/hooks'

export default function UserUpsertPage() {
  const params = useParams({ strict: false })
  const userId = params.userId ? Number(params.userId) : undefined
  const isEdit = Boolean(userId && userId > 0)
  const { form, onSubmit, isPending } = useUserUpsertForm(userId)
  const { data: user } = useUser(userId ?? 0, { enabled: isEdit })
  const updateAvatar = useUpdateUserAvatar(userId ?? 0)

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? m.user_edit() : m.user_create()}
        </h1>
        <CtButton asChild variant="destructive">
          <Link to="/users">{m.user_cancel()}</Link>
        </CtButton>
      </div>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="w-full max-w-2xl">
          {isEdit && user ? (
            <div className="mb-6">
              <CtUserAvatarEditor
                name={user.name}
                seed={user.id}
                src={user.avatar_url}
                size="lg"
                isPending={updateAvatar.isPending}
                onSelect={(file) => updateAvatar.mutate(file)}
              />
            </div>
          ) : null}
          <div className="grid gap-4 lg:grid-cols-2">
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
            <div className="lg:col-span-2">
              <CtTextInput
                name="password"
                label={isEdit ? m.user_password_optional() : m.auth_password_label()}
                type="password"
                rules={
                  isEdit
                    ? { minLength: { value: 8, message: m.auth_password_min() } }
                    : {
                        required: m.auth_password_required(),
                        minLength: { value: 8, message: m.auth_password_min() },
                      }
                }
                autoComplete="new-password"
              />
            </div>
            <div className="lg:col-span-2">
              <CtTextInput
                name="password_confirmation"
                label={m.auth_password_confirm_label()}
                type="password"
                rules={isEdit ? undefined : { required: m.auth_password_confirm_required() }}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="mt-6">
            <CtButton type="submit" disabled={isPending}>
              {isPending ? <CtSpinner className="size-4" /> : null}
              {m.user_save()}
            </CtButton>
          </div>
        </form>
      </FormProvider>
    </section>
  )
}
