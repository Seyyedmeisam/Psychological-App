const BASE = '/chats'

export const chatService = {
  list: () => BASE,
  people: () => `${BASE}/people`,
  create: () => BASE,
  messages: (id: number) => `${BASE}/${id}/messages`,
  send: (id: number) => `${BASE}/${id}/messages`,
}
