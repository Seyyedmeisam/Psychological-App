import { getRouteApi } from '@tanstack/react-router'
import { CtChatWorkspace } from '@/modules/chat/components/CtChatWorkspace'

const chatRoute = getRouteApi('/_panel/chats/$chatId/')

export default function ChatThreadPage() {
  const { chatId: chatIdParam } = chatRoute.useParams()
  const chatId = Number(chatIdParam)

  return (
    <CtChatWorkspace
      activeId={Number.isFinite(chatId) && chatId > 0 ? chatId : undefined}
    />
  )
}
