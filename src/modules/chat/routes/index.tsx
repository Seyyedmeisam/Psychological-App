import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/chats/')({
  component: lazy(() => import('@/modules/chat/pages/ChatsPage')),
})
