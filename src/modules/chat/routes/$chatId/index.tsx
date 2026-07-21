import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/chats/$chatId/')({
  component: lazy(() => import('@/modules/chat/pages/ChatThreadPage')),
})
