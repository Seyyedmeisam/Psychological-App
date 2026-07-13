import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel/books/')({
  component: lazy(() => import('@/modules/book/pages/BooksListPage')),
})
