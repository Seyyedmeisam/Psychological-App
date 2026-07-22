import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { buildPageHead } from '@/core/seo/pageHead'

export const Route = createFileRoute('/_panel/chats/')({
  head: () =>
    buildPageHead({
      title: m.chat_title(),
      description: m.chat_subtitle(),
      noIndex: true,
    }),
  component: lazy(() => import('@/modules/chat/pages/ChatsPage')),
})
