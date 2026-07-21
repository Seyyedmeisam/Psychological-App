import type { MentorVerificationStatus } from '@/modules/auth/types'
import type { User } from '@/modules/user/types'

export type MentorVerificationEvidence = {
  id: number
  original_name: string
  mime: string | null
  size: number
  url: string
  area_of_expertise: { id: number; name: string } | null
  created_at?: string | null
}

export type MentorVerificationMine = {
  status: MentorVerificationStatus | null
  note: string | null
  verified_at: string | null
  evidences: MentorVerificationEvidence[]
}

export type MentorVerificationUploadResult = MentorVerificationEvidence & {
  status: MentorVerificationStatus | null
}

export type AdminMentorVerificationItem = {
  user: User
  expertise: { id: number; name: string }[]
  evidences: MentorVerificationEvidence[]
}
