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
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from '@/modules/book/services'
import type { Book, BookFormValues, BooksListParams } from '@/modules/book/types'
import {
  bookToFormValues,
  normalizeBook,
  normalizeBooks,
} from '@/modules/book/utils'

export type BookUpsertResult = {
  form: ReturnType<typeof useForm<BookFormValues>>
  onSubmit: () => void
  isPending: boolean
}

export const useBooks = (
  params?: BooksListParams,
  options?: Omit<UseQueryOptions<Book[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.booksList(params),
    queryFn: async () => normalizeBooks(await getBooks(params)),
    ...options,
  })

export const useInfiniteBooks = (
  params?: BooksListParams,
  options?: Omit<
    UseInfiniteQueryOptions<Book[], Error, Book[], ReturnType<typeof queryKeys.booksInfinite>>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) =>
  useInfiniteQuery({
    queryKey: queryKeys.booksInfinite(params),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      normalizeBooks(
        await getBooks({
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

export const useBook = (
  id: number,
  options?: Omit<UseQueryOptions<Book | null>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.book(id),
    queryFn: async () => normalizeBook(await getBookById(id)),
    enabled: id > 0,
    ...options,
  })

export const useCreateBook = (
  options?: UseMutationOptions<Book, Error, BookFormValues>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: BookFormValues) =>
      normalizeBook(await createBook(values)) as Book,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.books })
      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdateBook = (
  id: number,
  options?: UseMutationOptions<Book, Error, BookFormValues>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: BookFormValues) =>
      normalizeBook(await updateBook(id, values)) as Book,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.books })
      await queryClient.invalidateQueries({ queryKey: queryKeys.book(id) })
      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteBook = (
  options?: UseMutationOptions<void, Error, number>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: async (data, id, ...rest) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.books })
      await queryClient.invalidateQueries({ queryKey: queryKeys.book(id) })
      await options?.onSuccess?.(data, id, ...rest)
    },
    ...options,
  })
}

export const useBookUpsertForm = (bookId?: number): BookUpsertResult => {
  const isEdit = Boolean(bookId && bookId > 0)
  const { data: book } = useBook(bookId ?? 0, { enabled: isEdit })
  const createMutation = useCreateBook()
  const updateMutation = useUpdateBook(bookId ?? 0)

  const form = useForm<BookFormValues>({
    values: bookToFormValues(book),
  })

  const mutation = isEdit ? updateMutation : createMutation

  return {
    form,
    isPending: mutation.isPending,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
  }
}
