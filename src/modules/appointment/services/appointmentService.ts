const EXPERTISE = '/areas-of-expertise'
const APPOINTMENTS = '/appointments'
const MENTOR_EXPERTISE = '/mentor/expertise'
const MENTOR_PROFILE = '/mentor/profile'
const MENTOR_VERIFICATION = '/mentor/verification'
const ADMIN_STATS = '/admin/stats'
const ADMIN_MENTOR_VERIFICATIONS = '/admin/mentor-verifications'

export const appointmentService = {
  areas: () => EXPERTISE,
  mentorsForArea: (id: number) => `${EXPERTISE}/${id}/mentors`,
  mentorExpertise: () => MENTOR_EXPERTISE,
  mentorProfile: () => MENTOR_PROFILE,
  mentorVerification: () => MENTOR_VERIFICATION,
  mentorVerificationEvidence: () => `${MENTOR_VERIFICATION}/evidence`,
  mentorVerificationEvidenceItem: (id: number) =>
    `${MENTOR_VERIFICATION}/evidence/${id}`,
  adminStats: () => ADMIN_STATS,
  adminMentorVerifications: () => ADMIN_MENTOR_VERIFICATIONS,
  adminMentorApprove: (userId: number) =>
    `${ADMIN_MENTOR_VERIFICATIONS}/${userId}/approve`,
  adminMentorReject: (userId: number) =>
    `${ADMIN_MENTOR_VERIFICATIONS}/${userId}/reject`,
  appointments: () => APPOINTMENTS,
  slots: () => `${APPOINTMENTS}/slots`,
  appointment: (id: number) => `${APPOINTMENTS}/${id}`,
  rating: (id: number) => `${APPOINTMENTS}/${id}/rating`,
  status: (id: number) => `${APPOINTMENTS}/${id}/status`,
  meetingJoin: (id: number) => `${APPOINTMENTS}/${id}/meeting/join`,
} as const
