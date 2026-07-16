const EXPERTISE = '/areas-of-expertise'
const APPOINTMENTS = '/appointments'
const MENTOR_EXPERTISE = '/mentor/expertise'

export const appointmentService = {
  areas: () => EXPERTISE,
  mentorsForArea: (id: number) => `${EXPERTISE}/${id}/mentors`,
  mentorExpertise: () => MENTOR_EXPERTISE,
  appointments: () => APPOINTMENTS,
  slots: () => `${APPOINTMENTS}/slots`,
  appointment: (id: number) => `${APPOINTMENTS}/${id}`,
} as const
