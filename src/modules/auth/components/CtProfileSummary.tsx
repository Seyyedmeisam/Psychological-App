import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { CtGroup } from '@/modules/app/components/surface/CtGroup'
import { CtListRow } from '@/modules/app/components/surface/CtListRow'
import { CtSurface } from '@/modules/app/components/surface/CtSurface'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtCard,
  CtCardContent,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'
import { useLogout } from '@/modules/auth/hooks'
import type { AuthUser } from '@/modules/auth/types'

function formatRole(role: AuthUser['role']) {
  if (role === 'mentor') {
    return m.auth_role_mentor()
  }
  if (role === 'admin') {
    return m.auth_role_admin()
  }
  return m.auth_role_user()
}

function formatMemberSince(value?: string) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat(getLocale(), {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export function CtProfileSummary({ user }: { user: AuthUser }) {
  const logout = useLogout()

  return (
    <div className="flex flex-col gap-6 ios-slide-up">
      <CtCard variant="inset">
        <CtCardHeader>
          <CtCardTitle className="text-2xl">{user.name}</CtCardTitle>
          <CtCardDescription>{m.auth_profile_subtitle()}</CtCardDescription>
        </CtCardHeader>
      </CtCard>

      <CtSurface title={m.auth_profile_details()}>
        <CtGroup>
          <CtListRow title={m.auth_name_label()} accessory={user.name} />
          <CtListRow title={m.auth_mobile_label()} accessory={user.mobile} />
          <CtListRow title={m.auth_profile_role()} accessory={formatRole(user.role)} />
          <CtListRow
            title={m.auth_profile_member_since()}
            accessory={formatMemberSince(user.created_at)}
          />
        </CtGroup>
      </CtSurface>

      <div className="flex flex-wrap gap-3">
        <CtButton
          type="button"
          variant="destructive"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {m.auth_logout()}
        </CtButton>
      </div>
    </div>
  )
}

export function CtProfileGuest() {
  return (
    <CtCard>
      <CtCardHeader>
        <CtCardTitle>{m.auth_profile_sign_in_required()}</CtCardTitle>
        <CtCardDescription>{m.auth_profile_sign_in_description()}</CtCardDescription>
      </CtCardHeader>
      <CtCardContent className="flex flex-wrap gap-3">
        <CtButton asChild>
          <Link to="/login">{m.auth_login()}</Link>
        </CtButton>
        <CtButton asChild variant="tinted">
          <Link to="/register">{m.auth_register()}</Link>
        </CtButton>
      </CtCardContent>
    </CtCard>
  )
}
