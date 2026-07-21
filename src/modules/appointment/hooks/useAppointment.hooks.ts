import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/core/constants/queryKeys'
import { m } from '@/core/i18n/paraglide/messages.js'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import {
  approveMentorVerification,
  bookAppointment,
  cancelAppointment,
  deleteMentorEvidence,
  getAdminMentorVerifications,
  getAdminStats,
  getAreasOfExpertise,
  getAvailableSlots,
  getMentorProfile,
  getMentorsForArea,
  getMyAppointments,
  getMyExpertise,
  getMyMentorVerification,
  joinAppointmentMeeting,
  rateAppointment,
  rejectMentorVerification,
  updateAppointmentStatus,
  updateMyExpertise,
  uploadMentorEvidence,
} from '@/modules/appointment/services'
import type {
  AdminMentorVerificationItem,
  AdminStats,
  Appointment,
  AreaOfExpertise,
  AvailableSlot,
  BookAppointmentInput,
  BookingMentor,
  MentorProfile,
  MentorVerificationMine,
  MentorVerificationUploadResult,
  RateAppointmentInput,
  SlotFilters,
  AppointmentJoinResponse,
  AppointmentStatusValue,
} from '@/modules/appointment/types'
import type { AuthUser } from '@/modules/auth/types'

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
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(queryKeys.mentorExpertise, data)
      toast.success(m.appointment_toast_expertise_saved())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
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
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({
        queryKey: ['appointments', 'slots'],
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStats })
      await queryClient.invalidateQueries({ queryKey: queryKeys.mentorProfile })
      toast.success(m.appointment_toast_booked())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
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
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({
        queryKey: ['appointments', 'slots'],
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStats })
      await queryClient.invalidateQueries({ queryKey: queryKeys.mentorProfile })
      toast.success(m.appointment_toast_cancelled())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useUpdateAppointmentStatus = (
  options?: UseMutationOptions<
    Appointment,
    Error,
    { appointmentId: number; status: AppointmentStatusValue }
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: updateAppointmentStatus,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({
        queryKey: ['appointments', 'slots'],
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStats })
      await queryClient.invalidateQueries({ queryKey: queryKeys.mentorProfile })
      toast.success(m.schedule_status_updated())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useRateAppointment = (
  options?: UseMutationOptions<Appointment, Error, RateAppointmentInput>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: rateAppointment,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.appointments })
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminStats })
      await queryClient.invalidateQueries({ queryKey: queryKeys.mentorProfile })
      toast.success(m.appointment_toast_rated())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useAdminStats = (
  options?: Omit<UseQueryOptions<AdminStats>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: getAdminStats,
    ...options,
  })

export const useMentorProfile = (
  options?: Omit<UseQueryOptions<MentorProfile>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.mentorProfile,
    queryFn: getMentorProfile,
    ...options,
  })

export const useJoinMeeting = (
  options?: UseMutationOptions<AppointmentJoinResponse, Error, number>,
) =>
  useMutation({
    ...options,
    mutationFn: joinAppointmentMeeting,
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })

export const useMyMentorVerification = (
  options?: Omit<UseQueryOptions<MentorVerificationMine>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.mentorVerification,
    queryFn: getMyMentorVerification,
    ...options,
  })

export const useUploadMentorEvidence = (
  options?: UseMutationOptions<
    MentorVerificationUploadResult,
    Error,
    { file: File; area_of_expertise_id?: number | null }
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: uploadMentorEvidence,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.mentorVerification,
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.me })
      toast.success(m.mentor_verification_toast_uploaded())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useDeleteMentorEvidence = (
  options?: UseMutationOptions<void, Error, number>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteMentorEvidence,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.mentorVerification,
      })
      toast.success(m.mentor_verification_toast_deleted())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useAdminMentorVerifications = (
  status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending',
  options?: Omit<
    UseQueryOptions<AdminMentorVerificationItem[]>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: queryKeys.adminMentorVerifications(status),
    queryFn: () => getAdminMentorVerifications(status),
    ...options,
  })

export const useApproveMentorVerification = (
  options?: UseMutationOptions<AuthUser, Error, number>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: approveMentorVerification,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'mentor-verifications'],
      })
      toast.success(m.mentor_verification_toast_approved())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useRejectMentorVerification = (
  options?: UseMutationOptions<
    AuthUser,
    Error,
    { userId: number; note?: string }
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: rejectMentorVerification,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'mentor-verifications'],
      })
      toast.success(m.mentor_verification_toast_rejected())
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}