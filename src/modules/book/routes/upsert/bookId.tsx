import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/books/upsert/bookId')({
  component: lazy(() => import('@/modules/book/pages/BookUpsertPage')),
})
