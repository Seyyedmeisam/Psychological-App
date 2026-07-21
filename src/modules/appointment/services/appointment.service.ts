import { requestHandler } from '@/core/api/requestHandler'
import { appointmentService } from '@/modules/appointment/services/appointmentService'
import type {
  AdminStats,
  Appointment,
  AreaOfExpertise,
  AvailableSlot,
  BookAppointmentInput,
  BookingMentor,
  MentorProfile,
  RateAppointmentInput,
  SlotFilters,
  AppointmentJoinResponse,
} from '@/modules/appointment/types'

export const getAreasOfExpertise = async () => {
  const response = await requestHandler.get<{ data: AreaOfExpertise[] }>(
    appointmentService.areas(),
  )
  return response.data.data
}

export const getMentorsForArea = async (areaId: number) => {
  const response = await requestHandler.get<{ data: BookingMentor[] }>(
    appointmentService.mentorsForArea(areaId),
  )
  return response.data.data
}

export const getMyExpertise = async () => {
  const response = await requestHandler.get<{
    data: { area_of_expertise_ids: number[] }
  }>(appointmentService.mentorExpertise())
  return response.data.data.area_of_expertise_ids
}

export const updateMyExpertise = async (areaOfExpertiseIds: number[]) => {
  const response = await requestHandler.put<{
    data: { area_of_expertise_ids: number[] }
  }>(appointmentService.mentorExpertise(), {
    area_of_expertise_ids: areaOfExpertiseIds,
  })
  return response.data.data.area_of_expertise_ids
}

export const getAvailableSlots = async (filters: SlotFilters) => {
  const response = await requestHandler.get<{ data: AvailableSlot[] }>(
    appointmentService.slots(),
    { params: filters },
  )
  return response.data.data
}

export const getMyAppointments = async () => {
  const response = await requestHandler.get<{ data: Appointment[] }>(
    appointmentService.appointments(),
  )
  return response.data.data
}

export const bookAppointment = async (input: BookAppointmentInput) => {
  const response = await requestHandler.post<{ data: Appointment }>(
    appointmentService.appointments(),
    input,
  )
  return response.data.data
}

export const cancelAppointment = async (id: number) => {
  const response = await requestHandler.delete<{ data: Appointment }>(
    appointmentService.appointment(id),
  )
  return response.data.data
}

export const rateAppointment = async (input: RateAppointmentInput) => {
  const response = await requestHandler.post<{ data: Appointment }>(
    appointmentService.rating(input.appointmentId),
    {
      score: input.score,
      comment: input.comment,
    },
  )
  return response.data.data
}

export const getAdminStats = async () => {
  const response = await requestHandler.get<{ data: AdminStats }>(
    appointmentService.adminStats(),
  )
  return response.data.data
}

export const getMentorProfile = async () => {
  const response = await requestHandler.get<{ data: MentorProfile }>(
    appointmentService.mentorProfile(),
  )
  return response.data.data
}

export const joinAppointmentMeeting = async (appointmentId: number) => {
  const response = await requestHandler.post<{ data: AppointmentJoinResponse }>(
    appointmentService.meetingJoin(appointmentId),
  )
  return response.data.data
}
