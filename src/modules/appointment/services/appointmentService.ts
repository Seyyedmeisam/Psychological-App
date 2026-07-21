const EXPERTISE = '/areas-of-expertise'
const APPOINTMENTS = '/appointments'
const MENTOR_EXPERTISE = '/mentor/expertise'
const MENTOR_PROFILE = '/mentor/profile'
const ADMIN_STATS = '/admin/stats'

export const appointmentService = {
  areas: () => EXPERTISE,
  mentorsForArea: (id: number) => `${EXPERTISE}/${id}/mentors`,
  mentorExpertise: () => MENTOR_EXPERTISE,
  mentorProfile: () => MENTOR_PROFILE,
  adminStats: () => ADMIN_STATS,
  appointments: () => APPOINTMENTS,
  slots: () => `${APPOINTMENTS}/slots`,
  appointment: (id: number) => `${APPOINTMENTS}/${id}`,
  rating: (id: number) => `${APPOINTMENTS}/${id}/rating`,
  meetingJoin: (id: number) => `${APPOINTMENTS}/${id}/meeting/join`,
} as const
