import { useNavigate } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { useStartConversation } from '@/modules/chat/hooks'

export function CtAppointmentChatButton({
  userId,
}: Readonly<{ userId: number }>) {
  const navigate = useNavigate()
  const startChat = useStartConversation({
    onSuccess: (conversation) => {
      void navigate({
        to: '/chats/$chatId',
        params: { chatId: String(conversation.id) },
      })
    },
  })

  return (
    <CtButton
      type="button"
      size="sm"
      variant="secondary"
      disabled={startChat.isPending}
      onClick={() => startChat.mutate(userId)}
    >
      {startChat.isPending ? (
        <CtSpinner className="size-4" />
      ) : (
        <MessageCircle className="size-4" aria-hidden />
      )}
      {m.appointment_chat()}
    </CtButton>
  )
}
