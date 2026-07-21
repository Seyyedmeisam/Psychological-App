export type TemplateSlot = {
  start: string
  end: string
}

export type AvailabilitySlot = {
  day_of_week: number
  start_time: string
  end_time: string
}

export type AvailabilityWeek = {
  mentor_id: number
  template_slots: TemplateSlot[]
  slots: AvailabilitySlot[]
}

export type AvailabilitySlotInput = {
  day_of_week: number
  start_time: string
}

/** Monday = 0 … Sunday = 6 */
export const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6] as const

export type WeekDay = (typeof WEEK_DAYS)[number]
