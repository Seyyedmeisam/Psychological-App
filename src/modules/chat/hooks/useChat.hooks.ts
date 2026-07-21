import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/core/constants/queryKeys'
import { getApiErrorMessage } from '@/modules/app/utils/apiErrorMessage'
import {
  getChatPeople,
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from '@/modules/chat/services'
import type { ChatMessage, ChatUser, Conversation } from '@/modules/chat/types'

export const useConversations = (
  options?: Omit<UseQueryOptions<Conversation[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.chats,
    queryFn: getConversations,
    refetchInterval: 8_000,
    ...options,
  })

export const useChatPeople = (
  search?: string,
  options?: Omit<UseQueryOptions<ChatUser[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.chatPeople(search),
    queryFn: () => getChatPeople(search),
    ...options,
  })

export const useMessages = (
  conversationId: number,
  options?: Omit<UseQueryOptions<ChatMessage[]>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: queryKeys.chatMessages(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: conversationId > 0,
    refetchInterval: 3_000,
    ...options,
  })

export const useStartConversation = (
  options?: UseMutationOptions<Conversation, Error, number>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: startConversation,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chats })
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}

export const useSendMessage = (
  options?: UseMutationOptions<
    ChatMessage,
    Error,
    { conversationId: number; body?: string; attachment?: File | null }
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: sendMessage,
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.setQueryData<ChatMessage[]>(
        queryKeys.chatMessages(variables.conversationId),
        (prev) => {
          if (!prev) return [data]
          if (prev.some((item) => item.id === data.id)) return prev
          return [...prev, data]
        },
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.chats })
      await options?.onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: async (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error))
      await options?.onError?.(error, variables, onMutateResult, context)
    },
  })
}
