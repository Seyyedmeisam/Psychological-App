import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import type {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query'
import { queryKeys } from '@/core/constants/queryKeys'
import { pagination } from '@/core/constants/pagination'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '@/modules/user/services'
import type { User, UserFormValues, UsersListParams } from '@/modules/user/types'
import {
  userToFormValues,
  normalizeUser,
  normalizeUsers,
} from '@/modules/user/utils'

export type UserUpsertResult = {
  form: ReturnType<typeof useForm<UserFormValues>>
  onSubmit: () => void
  isPending: boolean
}

export const useUsers = (
  params?: UsersListParams,
  options?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.usersList(params),
    queryFn: async () => normalizeUsers(await getUsers(params)),
    ...options,
  })

export const useInfiniteUsers = (
  params?: UsersListParams,
  options?: Omit<
    UseInfiniteQueryOptions<User[], Error, User[], ReturnType<typeof queryKeys.usersInfinite>>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) =>
  useInfiniteQuery({
    queryKey: queryKeys.usersInfinite(params),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      normalizeUsers(
        await getUsers({
          ...params,
          page: pageParam,
          per_page: params?.per_page ?? pagination.defaultPerPage,
        }),
      ),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length < (params?.per_page ?? pagination.defaultPerPage)
        ? undefined
        : (lastPageParam as number) + 1,
    ...options,
  })

export const useUser = (
  id: number,
  options?: Omit<UseQueryOptions<User | null>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.user(id),
    queryFn: async () => normalizeUser(await getUserById(id)),
    enabled: id > 0,
    ...options,
  })

export const useCreateUser = (
  options?: UseMutationOptions<User, Error, UserFormValues>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: UserFormValues) =>
      normalizeUser(await createUser(values)) as User,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users })
      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdateUser = (
  id: number,
  options?: UseMutationOptions<User, Error, UserFormValues>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: UserFormValues) =>
      normalizeUser(await updateUser(id, values)) as User,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users })
      await queryClient.invalidateQueries({ queryKey: queryKeys.user(id) })
      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteUser = (
  options?: UseMutationOptions<void, Error, number>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async (data, id, ...rest) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users })
      await queryClient.invalidateQueries({ queryKey: queryKeys.user(id) })
      await options?.onSuccess?.(data, id, ...rest)
    },
    ...options,
  })
}

export const useUserUpsertForm = (userId?: number): UserUpsertResult => {
  const isEdit = Boolean(userId && userId > 0)
  const { data: user } = useUser(userId ?? 0, { enabled: isEdit })
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser(userId ?? 0)

  const form = useForm<UserFormValues>({
    values: userToFormValues(user),
  })

  const mutation = isEdit ? updateMutation : createMutation

  return {
    form,
    isPending: mutation.isPending,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
  }
}
