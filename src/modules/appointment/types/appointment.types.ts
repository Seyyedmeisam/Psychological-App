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

export type Appointment = {
  id: number
  date: string
  start_time: string
  end_time: string
  status: string
  notes: string | null
  client: AppointmentPerson | null
  mentor: AppointmentPerson | null
  area_of_expertise: {
    id: number
    slug: string
    name: string
    name_en: string | null
  } | null
}

export type BookAppointmentInput = {
  area_of_expertise_id: number
  mentor_id: number
  date: string
  start_time: string
  notes?: string
}

export type SlotFilters = {
  area_of_expertise_id: number
  date?: string
  mentor_id?: number
  from?: string
  to?: string
  days?: number
}
