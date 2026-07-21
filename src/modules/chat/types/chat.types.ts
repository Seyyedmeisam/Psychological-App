export type ChatUser = {
  id: number
  name: string
  role: 'admin' | 'user' | 'mentor'
  avatar_url?: string | null
}

export type ChatAttachment = {
  url: string
  type: 'image' | 'audio' | 'file'
  name: string
  mime: string
  size: number
}

export type ChatMessage = {
  id: number
  conversation_id: number
  sender_id: number
  sender?: ChatUser
  body: string | null
  attachment: ChatAttachment | null
  created_at: string
}

export type Conversation = {
  id: number
  other_user: ChatUser
  last_message?: ChatMessage | null
  last_message_at?: string | null
  updated_at?: string
}
