import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import {
  CalendarDays,
  Camera,
  Pencil,
  Phone,
  Shield,
  UserRound,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { CtAvatar } from '@/modules/app/components/CtAvatar'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { CtTextArea, CtTextInput } from '@/modules/app/components/forms'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { useUpdateAvatar, useUpdateProfile } from '@/modules/auth/hooks'
import type { AuthUser, UpdateProfileFormValues } from '@/modules/auth/types'
import { cn } from '@/lib/utils'

const PROFILE_COVER =
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80'

function formatRole(role: AuthUser['role']) {
  if (role === 'mentor') return m.auth_role_mentor()
  if (role === 'admin') return m.auth_role_admin()
  return m.auth_role_user()
}

function formatMemberSince(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function DetailRow({
  icon,
  label,
  value,
  dir,
}: Readonly<{
  icon: ReactNode
  label: string
  value: string
  dir?: 'ltr' | 'rtl'
}>) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-start">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className="mt-0.5 truncate text-sm font-semibold text-foreground"
          dir={dir}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export function CtProfileSummary({ user }: Readonly<{ user: AuthUser }>) {
  const isMentor = user.role === 'mentor'
  const [editing, setEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const updateAvatar = useUpdateAvatar()
  const updateProfile = useUpdateProfile()

  const form = useForm<UpdateProfileFormValues>({
    defaultValues: {
      name: user.name,
      mobile: user.mobile,
      bio: user.bio ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: user.name,
      mobile: user.mobile,
      bio: user.bio ?? '',
    })
  }, [user, form])

  const onPickPhoto = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    updateAvatar.mutate(file)
  }

  const onSave = form.handleSubmit((values) => {
    const payload: UpdateProfileFormValues = {
      name: values.name,
      mobile: values.mobile,
    }
    if (isMentor) {
      payload.bio = values.bio?.trim() || null
    }

    updateProfile.mutate(payload, {
      onSuccess: () => setEditing(false),
    })
  })

  const onCancel = () => {
    form.reset({
      name: user.name,
      mobile: user.mobile,
      bio: user.bio ?? '',
    })
    setEditing(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 ios-slide-up">
      <CtCard className="overflow-hidden border border-border/70 p-0 shadow-ios-md">
        <div className="relative h-36 overflow-hidden sm:h-44">
          <img
            src={PROFILE_COVER}
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-foreground/25 to-foreground/10" />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-e-10 -top-8 size-40 rounded-full bg-primary/30 blur-3xl"
          />
        </div>

        <div className="relative px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:-mt-14">
            <div className="flex w-full items-end justify-between gap-3">
              <div className="relative">
                <CtAvatar
                  name={user.name}
                  seed={user.id}
                  src={user.avatar_url}
                  size="xl"
                  className="shadow-ios-md ring-[5px] ring-card"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={onFileChange}
                />
                <button
                  type="button"
                  onClick={onPickPhoto}
                  disabled={updateAvatar.isPending}
                  aria-label={m.auth_profile_change_photo()}
                  className={cn(
                    'absolute inset-e-0 bottom-0 flex size-9 items-center justify-center rounded-full',
                    'border-2 border-card bg-primary text-primary-foreground shadow-ios-sm',
                    'transition-transform ios-press hover:brightness-105',
                    'disabled:pointer-events-none disabled:opacity-60',
                  )}
                >
                  {updateAvatar.isPending ? (
                    <CtSpinner className="size-4" />
                  ) : (
                    <Camera className="size-4" />
                  )}
                </button>
              </div>

              {!editing ? (
                <CtButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="size-3.5" />
                  {m.auth_profile_edit()}
                </CtButton>
              ) : null}
            </div>

            <div className="min-w-0 text-start">
              <h2 className="truncate text-2xl font-bold tracking-tight text-foreground">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {m.auth_profile_subtitle()}
              </p>
              <span className="mt-2 inline-flex rounded-xl bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
                {formatRole(user.role)}
              </span>
            </div>
          </div>
        </div>
      </CtCard>

      {editing ? (
        <CtCard className="border border-border/70 shadow-ios-sm">
          <CtCardHeader>
            <CtCardTitle className="text-base">
              {m.auth_profile_edit()}
            </CtCardTitle>
            <CtCardDescription>{m.auth_profile_details()}</CtCardDescription>
          </CtCardHeader>
          <CtCardContent>
            <FormProvider {...form}>
              <form onSubmit={onSave} className="flex flex-col gap-4">
                <CtTextInput
                  name="name"
                  label={m.auth_name_label()}
                  rules={{ required: m.auth_name_required() }}
                  autoComplete="name"
                />
                <CtTextInput
                  name="mobile"
                  label={m.auth_mobile_label()}
                  rules={{ required: m.auth_mobile_required() }}
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                />
                {isMentor ? (
                  <CtTextArea
                    name="bio"
                    label={m.auth_profile_about_label()}
                    rows={5}
                    placeholder={m.auth_profile_about_placeholder()}
                    rules={{
                      maxLength: {
                        value: 2000,
                        message: m.auth_profile_about_max(),
                      },
                    }}
                  />
                ) : null}
                <div className="flex flex-wrap gap-3 pt-1">
                  <CtButton
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="min-w-28"
                  >
                    {updateProfile.isPending ? (
                      <CtSpinner className="size-4" />
                    ) : null}
                    {m.user_save()}
                  </CtButton>
                  <CtButton
                    type="button"
                    variant="destructive"
                    onClick={onCancel}
                    disabled={updateProfile.isPending}
                  >
                    {m.user_cancel()}
                  </CtButton>
                </div>
              </form>
            </FormProvider>
          </CtCardContent>
        </CtCard>
      ) : (
        <>
          {isMentor ? (
            <CtCard className="overflow-hidden border border-border/70 p-0 shadow-ios-sm">
              <CtCardHeader className="border-b border-border/60 bg-secondary/40 py-4">
                <CtCardTitle className="text-base">
                  {m.auth_profile_about_label()}
                </CtCardTitle>
              </CtCardHeader>
              <CtCardContent className="px-5 py-4">
                {user.bio?.trim() ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {m.auth_profile_about_empty()}
                  </p>
                )}
              </CtCardContent>
            </CtCard>
          ) : null}

          <CtCard className="overflow-hidden border border-border/70 p-0 shadow-ios-sm">
            <CtCardHeader className="border-b border-border/60 bg-secondary/40 py-4">
              <CtCardTitle className="text-base">
                {m.auth_profile_details()}
              </CtCardTitle>
            </CtCardHeader>
            <CtCardContent className="divide-y divide-border/60 p-0">
              <DetailRow
                icon={<UserRound className="size-4" />}
                label={m.auth_name_label()}
                value={user.name}
              />
              <DetailRow
                icon={<Shield className="size-4" />}
                label={m.auth_profile_role()}
                value={formatRole(user.role)}
              />
              <DetailRow
                icon={<CalendarDays className="size-4" />}
                label={m.auth_profile_member_since()}
                value={formatMemberSince(user.created_at)}
              />
              <DetailRow
                icon={<Phone className="size-4" />}
                label={m.auth_mobile_label()}
                value={user.mobile}
                dir="ltr"
              />
            </CtCardContent>
          </CtCard>
        </>
      )}
    </div>
  )
}

export function CtProfileGuest() {
  return (
    <div className="mx-auto w-full max-w-md ios-slide-up">
      <CtCard className="overflow-hidden border border-border/70 p-0 shadow-ios-md">
        <div className="relative flex flex-col items-center gap-4 bg-linear-to-br from-primary/15 via-card to-card px-6 pb-2 pt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 size-36 rounded-full bg-primary/20 blur-3xl"
          />
          <span
            className={cn(
              'relative flex size-24 items-center justify-center overflow-hidden rounded-full',
              'bg-secondary text-muted-foreground shadow-ios-sm ring-4 ring-card',
            )}
          >
            <UserRound className="size-10" />
          </span>
          <CtCardHeader className="items-center px-0 pb-2 text-center">
            <CtCardTitle className="text-xl">
              {m.auth_profile_sign_in_required()}
            </CtCardTitle>
            <CtCardDescription className="text-balance">
              {m.auth_profile_sign_in_description()}
            </CtCardDescription>
          </CtCardHeader>
        </div>
        <CtCardContent className="flex flex-col gap-3 px-6 py-6 sm:flex-row">
          <CtButton asChild className="h-11 flex-1 rounded-2xl">
            <Link to="/login">{m.auth_login()}</Link>
          </CtButton>
          <CtButton asChild variant="tinted" className="h-11 flex-1 rounded-2xl">
            <Link to="/register">{m.auth_register()}</Link>
          </CtButton>
        </CtCardContent>
      </CtCard>
    </div>
  )
}
