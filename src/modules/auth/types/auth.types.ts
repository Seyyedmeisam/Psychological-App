export type UserRole = 'admin' | 'user' | 'mentor'

export type MentorVerificationStatus = 'pending' | 'approved' | 'rejected'

export type AuthUser = {
  id: number
  name: string
  mobile: string
  email?: string | null
  role: UserRole
  avatar_url?: string | null
  bio?: string | null
  mentor_verification_status?: MentorVerificationStatus | null
  mentor_verification_note?: string | null
  mentor_verified_at?: string | null
  created_at?: string
}

export type LoginFormValues = {
  mobile: string
  password: string
}

export type RegisterFormValues = {
  name: string
  mobile: string
  password: string
  password_confirmation: string
  role: 'user' | 'mentor'
}

export type UpdateProfileFormValues = {
  name: string
  mobile: string
  bio?: string | null
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
