import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/core/constants/queryKeys'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import {
  getAvailabilityTemplate,
  getMyAvailability,
  updateMyAvailability,
} from '@/modules/schedule/services'
import type {
  AvailabilitySlotInput,
  AvailabilityWeek,
  TemplateSlot,
} from '@/modules/schedule/types'

export const useAvailabilityTemplate = (
  options?: Omit<
    UseQueryOptions<{
      slots: TemplateSlot[]
      day_start: string
      day_end: string
      session_minutes: number
      break_minutes: number
    }>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: queryKeys.availabilityTemplate,
    queryFn: getAvailabilityTemplate,
    staleTime: Infinity,
    ...options,
  })

export const useMyAvailability = (
  options?: Omit<UseQueryOptions<AvailabilityWeek>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.availabilityMine,
    queryFn: getMyAvailability,
    ...options,
  })

export const useUpdateMyAvailability = (
  options?: UseMutationOptions<AvailabilityWeek, Error, AvailabilitySlotInput[]>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: updateMyAvailability,
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.setQueryData(queryKeys.availabilityMine, data)
      toast.success('برنامه هفتگی ذخیره شد')
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}
