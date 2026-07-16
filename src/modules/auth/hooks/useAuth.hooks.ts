import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/core/constants/queryKeys'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import { getAuthToken, setAuthToken } from '@/modules/auth/constants/auth'
import { getMe, login, logout, register } from '@/modules/auth/services'
import type {
  AuthResponse,
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from '@/modules/auth/types'
import { getHomePathByRole } from '@/modules/auth/utils/homePath'

export const useMe = (
  options?: Omit<UseQueryOptions<AuthUser>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: Boolean(getAuthToken()),
    retry: false,
    ...options,
  })

/** Session view for UI: trust token immediately to avoid guest/auth flicker. */
export const useAuthSession = (
  options?: Omit<UseQueryOptions<AuthUser>, 'queryKey' | 'queryFn'>,
) => {
  const hasToken = Boolean(getAuthToken())
  const query = useMe(options)

  return {
    hasToken,
    user: query.data,
    /** Token present but /me has not resolved yet */
    isResolving: hasToken && query.isLoading,
    ...query,
  }
}

export const useLogin = (
  options?: UseMutationOptions<AuthResponse, Error, LoginFormValues>,
) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    ...options,
    mutationFn: login,
    onSuccess: async (data, variables, context) => {
      setAuthToken(data.token)
      queryClient.setQueryData(queryKeys.me, data.user)
      toast.success('با موفقیت وارد شدید')
      await options?.onSuccess?.(data, variables, context)
      await navigate({ to: getHomePathByRole(data.user.role) })
    },
    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
    },
  })
}

export const useRegister = (
  options?: UseMutationOptions<AuthResponse, Error, RegisterFormValues>,
) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    ...options,
    mutationFn: register,
    onSuccess: async (data, variables, context) => {
      setAuthToken(data.token)
      queryClient.setQueryData(queryKeys.me, data.user)
      toast.success('ثبت‌نام با موفقیت انجام شد')
      await options?.onSuccess?.(data, variables, context)
      await navigate({ to: getHomePathByRole(data.user.role) })
    },
    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
    },
  })
}

export const useLogout = (
  options?: UseMutationOptions<void, Error, void>,
) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    ...options,
    mutationFn: logout,
    onSuccess: async (data, variables, context) => {
      setAuthToken(null)
      queryClient.removeQueries({ queryKey: queryKeys.me })
      toast.success('خارج شدید')
      await options?.onSuccess?.(data, variables, context)
      await navigate({ to: '/login' })
    },
    onError: async (error, variables, context) => {
      setAuthToken(null)
      queryClient.removeQueries({ queryKey: queryKeys.me })
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, context)
      await navigate({ to: '/login' })
    },
  })
}

export const useLoginForm = () => {
  const mutation = useLogin()
  const form = useForm<LoginFormValues>({
    defaultValues: { mobile: '', password: '' },
  })

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

export const useRegisterForm = () => {
  const mutation = useRegister()
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      mobile: '',
      password: '',
      password_confirmation: '',
      role: 'user',
    },
  })

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
