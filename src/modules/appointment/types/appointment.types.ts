export type AreaOfExpertise = {
  id: number
  slug: string
  name: string
  name_en: string | null
  description: string | null
  sort_order: number
}

export type BookingMentor = {
  id: number
  name: string
  mobile?: string
}

export type AvailableSlot = {
  mentor_id: number
  mentor_name: string
  date: string
  day_of_week: number
  start_time: string
  end_time: string
  area_of_expertise_id: number
}

export type AppointmentPerson = {
  id: number
  name: string
  mobile: string
}

export type AppointmentRating = {
  score: number
  comment: string | null
}

export type AppointmentStatusValue =
  | 'confirmed'
  | 'cancelled'
  | 'user_absent'
  | 'mentor_absent'

export type Appointment = {
  id: number
  date: string
  start_time: string
  end_time: string
  status: AppointmentStatusValue | string
  notes: string | null
  is_completed?: boolean
  can_rate?: boolean
  meeting_url?: string | null
  is_in_session?: boolean
  can_join_meeting?: boolean
  client: AppointmentPerson | null
  mentor: AppointmentPerson | null
  area_of_expertise: {
    id: number
    slug: string
    name: string
    name_en: string | null
  } | null
  rating?: AppointmentRating | null
}

export type BookAppointmentInput = {
  area_of_expertise_id: number
  mentor_id: number
  date: string
  start_time: string
  notes?: string
}

export type RateAppointmentInput = {
  appointmentId: number
  score: number
  comment?: string
}

export type AppointmentJoinResponse = {
  meeting_url: string
  can_join_meeting: boolean
  is_in_session: boolean
}

export type SlotFilters = {
  area_of_expertise_id: number
  date?: string
  mentor_id?: number
  from?: string
  to?: string
  days?: number
}

export type AdminStatsTrendPoint = {
  date: string
  count: number
}

export type AdminStatsStatusCount = {
  status: string
  count: number
}

export type AdminStatsRatingBucket = {
  score: number
  count: number
}

export type AdminStatsTopMentor = {
  id: number
  name: string
  avatar: string | null
  meetings_count: number
  rating_average: number | null
  rating_count: number
}

export type AdminStatsRecentAppointment = {
  id: number
  date: string
  start_time: string
  end_time: string
  status: string
  is_completed: boolean
  client: { id: number | null; name: string | null }
  mentor: { id: number | null; name: string | null }
  area_of_expertise: { id: number; name: string } | null
}

export type AdminStats = {
  clients_total: number
  mentors_total: number
  admins_total: number
  users_total: number
  clients_booked: number
  appointments_total: number
  meetings_confirmed: number
  meetings_cancelled: number
  meetings_user_absent: number
  meetings_mentor_absent: number
  meetings_upcoming: number
  meetings_completed: number
  rating_average: number | null
  rating_count: number
  conversations_total: number
  messages_total: number
  messages_today: number
  appointments_by_status: AdminStatsStatusCount[]
  appointments_trend: AdminStatsTrendPoint[]
  rating_distribution: AdminStatsRatingBucket[]
  top_mentors: AdminStatsTopMentor[]
  recent_appointments: AdminStatsRecentAppointment[]
}

export type MentorProfile = {
  mentor: {
    id: number
    name: string
    mobile: string | null
    email: string | null
    bio?: string | null
    avatar_url?: string | null
  }
  stats: {
    meetings_done: number
    meetings_upcoming: number
    meetings_cancelled: number
  }
  expertise: Array<{
    id: number
    slug: string
    name: string
    name_en: string | null
  }>
  meetings_by_expertise: Array<{
    area_of_expertise_id: number
    name: string
    name_en: string | null
    meetings_done: number
  }>
  availability: Array<{
    day_of_week: number
    start_time: string
    end_time: string
  }>
  template_slots: Array<{ start: string; end: string }>
  recent_meetings: Array<{
    id: number
    date: string
    start_time: string
    end_time: string
    status: string
    notes?: string | null
    is_completed: boolean
    is_in_session?: boolean
    can_join_meeting?: boolean
    meeting_url?: string | null
    client: { id: number; name: string; mobile?: string | null } | null
    area_of_expertise: {
      id: number
      name: string
      name_en: string | null
    } | null
  }>
}
