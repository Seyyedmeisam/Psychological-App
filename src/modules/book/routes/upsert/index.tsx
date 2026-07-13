import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/books/upsert/')({
  component: lazy(() => import('@/modules/book/pages/BookUpsertPage')),
})
