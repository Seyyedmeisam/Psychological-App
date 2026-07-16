import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/core/constants/queryKeys'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import {
  bookAppointment,
  cancelAppointment,
  getAreasOfExpertise,
  getAvailableSlots,
  getMentorsForArea,
  getMyAppointments,
  getMyExpertise,
  updateMyExpertise,
} from '@/modules/appointment/services'
import type {
  Appointment,
  AreaOfExpertise,
  AvailableSlot,
  BookAppointmentInput,
  BookingMentor,
  SlotFilters,
} from '@/modules/appointment/types'

export const useAreasOfExpertise = (
  options?: Omit<UseQueryOptions<AreaOfExpertise[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.areasOfExpertise,
    queryFn: getAreasOfExpertise,
    staleTime: 5 * 60_000,
    ...options,
  })

export const useMentorsForArea = (
  areaId: number | null,
  options?: Omit<UseQueryOptions<BookingMentor[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.mentorsForArea(areaId ?? 0),
    queryFn: () => getMentorsForArea(areaId!),
    enabled: Boolean(areaId),
    ...options,
  })

export const useMyExpertise = (
  options?: Omit<UseQueryOptions<number[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.mentorExpertise,
    queryFn: getMyExpertise,
    ...options,
  })

export const useUpdateMyExpertise = (
  options?: UseMutationOptions<number[], Error, number[]>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: updateMyExpertise,
    onSuccess: async (data, variables, context) => {
      queryClient.setQueryData(queryKeys.mentorExpertise, data)
      toast.success('حوزه‌های تخصصی ذخیره شد')
      await options?.onSuccess?.(data, variables, context)
    },
    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
    },
  })
}

export const useAvailableSlots = (
  filters: SlotFilters | null,
  options?: Omit<UseQueryOptions<AvailableSlot[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.appointmentSlots(filters ?? {}),
    queryFn: () => getAvailableSlots(filters!),
    enabled: Boolean(filters?.area_of_expertise_id),
    ...options,
  })

export const useMyAppointments = (
  options?: Omit<UseQueryOptions<Appointment[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.appointments,
    queryFn: getMyAppointments,
    ...options,
  })

export const useBookAppointment = (
  options?: UseMutationOptions<Appointment, Error, BookAppointmentInput>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: bookAppointment,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({
        queryKey: ['appointments', 'slots'],
      })
      toast.success('نوبت با موفقیت ثبت شد')
      await options?.onSuccess?.(data, variables, context)
    },
    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
    },
  })
}

export const useCancelAppointment = (
  options?: UseMutationOptions<Appointment, Error, number>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: cancelAppointment,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({
        queryKey: ['appointments', 'slots'],
      })
      toast.success('نوبت لغو شد')
      await options?.onSuccess?.(data, variables, context)
    },
    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
    },
  })
}
