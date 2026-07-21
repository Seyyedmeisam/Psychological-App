export type UserRole = 'admin' | 'user' | 'mentor'

export type MentorVerificationStatus = 'pending' | 'approved' | 'rejected'

export type User = {
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

export type UserFormValues = {
  name: string
  mobile: string
  email?: string
  password?: string
  password_confirmation?: string
  role: UserRole
}

export type UsersListParams = {
  page?: number
  per_page?: number
  search?: string
  role?: UserRole
  [key: string]: unknown
}
