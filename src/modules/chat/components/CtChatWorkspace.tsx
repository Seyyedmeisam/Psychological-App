import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  FileIcon,
  ImageIcon,
  Mic,
  Paperclip,
  Search,
  SendHorizontal,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { m } from '@/core/i18n/paraglide/messages.js'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtAvatar } from '@/modules/app/components/CtAvatar'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtInput } from '@/modules/app/components/CtInput'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { useMe } from '@/modules/auth/hooks'
import {
  useChatPeople,
  useConversations,
  useMessages,
  useSendMessage,
  useStartConversation,
} from '@/modules/chat/hooks'
import type { ChatAttachment, ChatMessage, Conversation } from '@/modules/chat/types'
import { cn } from '@/lib/utils'

const MAX_BYTES = 5 * 1024 * 1024

function roleLabel(role: string) {
  if (role === 'mentor') return m.auth_role_mentor()
  if (role === 'admin') return m.auth_role_admin()
  return m.auth_role_user()
}

function formatTime(value?: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat(getLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function attachmentIcon(file: File) {
  if (file.type.startsWith('image/')) {
    return <ImageIcon className="size-4 text-primary" />
  }
  if (file.type.startsWith('audio/')) {
    return <Mic className="size-4 text-primary" />
  }
  return <FileIcon className="size-4 text-primary" />
}

function AttachmentView({ attachment }: Readonly<{ attachment: ChatAttachment }>) {
  if (attachment.type === 'image') {
    return (
      <a href={attachment.url} target="_blank" rel="noreferrer" className="block">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-56 max-w-full rounded-xl object-cover"
        />
      </a>
    )
  }

  if (attachment.type === 'audio') {
    return (
      <audio controls src={attachment.url} className="w-full max-w-xs">
        <track kind="captions" />
      </audio>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2 text-sm font-medium underline-offset-2 hover:underline"
    >
      <FileIcon className="size-4 shrink-0" />
      <span className="min-w-0 truncate">{attachment.name}</span>
      <span className="text-xs text-muted-foreground">
        {formatSize(attachment.size)}
      </span>
    </a>
  )
}

function MessageBubble({
  message,
  mine,
}: Readonly<{ message: ChatMessage; mine: boolean }>) {
  return (
    <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-ios-sm sm:max-w-[70%]',
          mine
            ? 'rounded-ee-md bg-primary text-primary-foreground'
            : 'rounded-es-md border border-border/70 bg-card text-foreground',
        )}
      >
        {message.body ? (
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.body}
          </p>
        ) : null}
        {message.attachment ? (
          <div className={cn(message.body ? 'mt-2' : undefined)}>
            <AttachmentView attachment={message.attachment} />
          </div>
        ) : null}
        <p
          className={cn(
            'mt-1 text-[11px]',
            mine ? 'text-primary-foreground/75' : 'text-muted-foreground',
          )}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}

function ConversationRow({
  item,
  active,
  onClick,
}: Readonly<{
  item: Conversation
  active: boolean
  onClick: () => void
}>) {
  const preview =
    item.last_message?.body?.trim() ||
    (item.last_message?.attachment
      ? m.chat_attachment_preview()
      : m.chat_no_messages())

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-3 text-start transition-colors',
        active ? 'bg-primary/10' : 'hover:bg-secondary/70',
      )}
    >
      <CtAvatar
        name={item.other_user.name}
        seed={item.other_user.id}
        src={item.other_user.avatar_url}
        size="md"
        className="ring-2 ring-card"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.other_user.name}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatTime(item.last_message_at)}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{preview}</p>
      </div>
    </button>
  )
}

function Composer({
  conversationId,
}: Readonly<{ conversationId: number }>) {
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const send = useSendMessage()

  const onPick = (next: File | null) => {
    if (!next) {
      setFile(null)
      return
    }
    if (next.size > MAX_BYTES) {
      toast.error(m.chat_file_too_large())
      return
    }
    setFile(next)
  }

  const onSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if ((!body.trim() && !file) || send.isPending) return

    send.mutate(
      {
        conversationId,
        body: body.trim() || undefined,
        attachment: file,
      },
      {
        onSuccess: () => {
          setBody('')
          setFile(null)
          if (fileRef.current) fileRef.current.value = ''
        },
      },
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-border/70 bg-card/90 p-3 backdrop-blur-sm"
    >
      {file ? (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm">
          {attachmentIcon(file)}
          <span className="min-w-0 flex-1 truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatSize(file.size)}
          </span>
          <button
            type="button"
            onClick={() => onPick(null)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-background"
            aria-label={m.chat_remove_attachment()}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
          onChange={(event) => onPick(event.target.files?.[0] ?? null)}
        />
        <CtButton
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => fileRef.current?.click()}
          aria-label={m.chat_attach()}
        >
          <Paperclip className="size-4" />
        </CtButton>
        <CtInput
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={m.chat_placeholder()}
          className="min-h-11 flex-1"
          maxLength={5000}
        />
        <CtButton
          type="submit"
          size="icon"
          disabled={send.isPending || (!body.trim() && !file)}
          aria-label={m.chat_send()}
        >
          {send.isPending ? (
            <CtSpinner className="size-4" />
          ) : (
            <SendHorizontal className="size-4" />
          )}
        </CtButton>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {m.chat_file_limit_hint()}
      </p>
    </form>
  )
}

function Thread({
  conversation,
}: Readonly<{ conversation: Conversation }>) {
  const navigate = useNavigate()
  const me = useMe()
  const messagesQuery = useMessages(conversation.id)
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = messagesQuery.data ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, conversation.id])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
        <CtButton
          type="button"
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          onClick={() => void navigate({ to: '/chats' })}
          aria-label={m.chat_back()}
        >
          <ArrowLeft className="size-4" />
        </CtButton>
        <CtAvatar
          name={conversation.other_user.name}
          seed={conversation.other_user.id}
          src={conversation.other_user.avatar_url}
          size="sm"
        />
        <div className="min-w-0 text-start">
          <p className="truncate font-semibold text-foreground">
            {conversation.other_user.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {roleLabel(conversation.other_user.role)}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <CtAsyncContent
          isLoading={messagesQuery.isLoading}
          isError={messagesQuery.isError}
          errorMessage={messagesQuery.error?.message}
        >
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {m.chat_thread_empty()}
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mine={message.sender_id === me.data?.id}
              />
            ))
          )}
          <div ref={bottomRef} />
        </CtAsyncContent>
      </div>

      <Composer conversationId={conversation.id} />
    </div>
  )
}

export function CtChatWorkspace({
  activeId,
}: Readonly<{ activeId?: number }>) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [peopleOpen, setPeopleOpen] = useState(false)
  const conversationsQuery = useConversations()
  const peopleQuery = useChatPeople(search.trim() || undefined, {
    enabled: peopleOpen,
  })
  const startConversation = useStartConversation()

  const conversations = conversationsQuery.data ?? []
  const active = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  )

  const { refetch: refetchConversations, isLoading: conversationsLoading } =
    conversationsQuery

  useEffect(() => {
    if (activeId && !active && !conversationsLoading) {
      void refetchConversations()
    }
  }, [activeId, active, conversationsLoading, refetchConversations])

  const openConversation = (id: number) => {
    void navigate({
      to: '/chats/$chatId',
      params: { chatId: String(id) },
    })
  }

  const onStart = (userId: number) => {
    startConversation.mutate(userId, {
      onSuccess: (conversation) => {
        setPeopleOpen(false)
        setSearch('')
        openConversation(conversation.id)
      },
    })
  }

  return (
    <section className="mx-auto flex h-[min(78vh,820px)] w-full max-w-6xl flex-col gap-4 px-4 py-6 ios-slide-up sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {m.chat_title()}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {m.chat_subtitle()}
          </p>
        </div>
        <CtButton
          type="button"
          variant={peopleOpen ? 'secondary' : 'default'}
          onClick={() => setPeopleOpen((value) => !value)}
        >
          {peopleOpen ? m.chat_close_new() : m.chat_new()}
        </CtButton>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-ios-sm">
        <aside
          className={cn(
            'flex w-full flex-col border-border/70 sm:w-80 sm:border-e',
            activeId ? 'hidden sm:flex' : 'flex',
          )}
        >
          {peopleOpen ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-border/70 p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <CtInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={m.chat_search_people()}
                    className="ps-9"
                  />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <CtAsyncContent
                  isLoading={peopleQuery.isLoading}
                  isError={peopleQuery.isError}
                  errorMessage={peopleQuery.error?.message}
                >
                  {(peopleQuery.data ?? []).length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      {m.chat_people_empty()}
                    </p>
                  ) : (
                    (peopleQuery.data ?? []).map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        disabled={startConversation.isPending}
                        onClick={() => onStart(person.id)}
                        className="flex w-full items-center gap-3 px-3 py-3 text-start hover:bg-secondary/70"
                      >
                        <CtAvatar
                          name={person.name}
                          seed={person.id}
                          src={person.avatar_url}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {person.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {roleLabel(person.role)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </CtAsyncContent>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <CtAsyncContent
                isLoading={conversationsQuery.isLoading}
                isError={conversationsQuery.isError}
                errorMessage={conversationsQuery.error?.message}
              >
                {conversations.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    {m.chat_empty()}
                  </p>
                ) : (
                  conversations.map((item) => (
                    <ConversationRow
                      key={item.id}
                      item={item}
                      active={item.id === activeId}
                      onClick={() => openConversation(item.id)}
                    />
                  ))
                )}
              </CtAsyncContent>
            </div>
          )}
        </aside>

        <div
          className={cn(
            'min-h-0 min-w-0 flex-1',
            activeId ? 'flex' : 'hidden sm:flex',
          )}
        >
          {active ? (
            <Thread conversation={active} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
              {m.chat_select_prompt()}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
