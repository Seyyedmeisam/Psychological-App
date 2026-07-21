import { requestHandler } from '@/core/api/requestHandler'
import { scheduleService } from '@/modules/schedule/services/scheduleService'
import type {
  AvailabilitySlotInput,
  AvailabilityWeek,
  TemplateSlot,
} from '@/modules/schedule/types'

export const getAvailabilityTemplate = async () => {
  const response = await requestHandler.get<{
    data: {
      slots: TemplateSlot[]
      day_start: string
      day_end: string
      session_minutes: number
      break_minutes: number
    }
  }>(scheduleService.template())
  return response.data.data
}

export const getMyAvailability = async () => {
  const response = await requestHandler.get<{ data: AvailabilityWeek }>(
    scheduleService.mine(),
  )
  return response.data.data
}

export const updateMyAvailability = async (slots: AvailabilitySlotInput[]) => {
  const response = await requestHandler.put<{ data: AvailabilityWeek }>(
    scheduleService.mine(),
    { slots },
  )
  return response.data.data
}
