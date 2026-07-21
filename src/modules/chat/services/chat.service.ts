import { requestHandler } from '@/core/api/requestHandler'
import { chatService } from '@/modules/chat/services/chatService'
import type { ChatMessage, ChatUser, Conversation } from '@/modules/chat/types'

export const getConversations = async () => {
  const response = await requestHandler.get<{ data: Conversation[] }>(
    chatService.list(),
  )
  return response.data.data
}

export const getChatPeople = async (search?: string) => {
  const response = await requestHandler.get<{ data: ChatUser[] }>(
    chatService.people(),
    { params: search ? { search } : undefined },
  )
  return response.data.data
}

export const startConversation = async (userId: number) => {
  const response = await requestHandler.post<{ data: Conversation }>(
    chatService.create(),
    { user_id: userId },
  )
  return response.data.data
}

export const getMessages = async (conversationId: number, afterId?: number) => {
  const response = await requestHandler.get<{ data: ChatMessage[] }>(
    chatService.messages(conversationId),
    { params: afterId ? { after_id: afterId } : undefined },
  )
  return response.data.data
}

export const sendMessage = async (input: {
  conversationId: number
  body?: string
  attachment?: File | null
}) => {
  const formData = new FormData()
  if (input.body?.trim()) {
    formData.append('body', input.body.trim())
  }
  if (input.attachment) {
    formData.append('attachment', input.attachment)
  }

  const response = await requestHandler.post<{ data: ChatMessage }>(
    chatService.send(input.conversationId),
    formData,
  )
  return response.data.data
}
