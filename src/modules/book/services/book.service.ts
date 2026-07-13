import { requestHandler } from '@/core/api/requestHandler'
import { bookService } from '@/modules/book/services/bookService'
import type { Book, BookFormValues, BooksListParams } from '@/modules/book/types/book.types'

export const getBooks = async (params?: BooksListParams) => {
  const response = await requestHandler.get<Book[] | { data: Book[] }>(
    bookService.getBooks(),
    { params },
  )
  return response.data
}

export const getBookById = async (id: number) => {
  const response = await requestHandler.get<Book | { data: Book }>(
    bookService.getBookById(id),
  )
  return response.data
}

export const createBook = async (values: BookFormValues) => {
  const response = await requestHandler.post<Book>(bookService.createBook(), {
    title: values.title,
    author: values.author,
    description: values.description,
    status: values.status,
  })
  return response.data
}

export const updateBook = async (id: number, values: BookFormValues) => {
  const response = await requestHandler.put<Book>(bookService.updateBook(id), {
    title: values.title,
    author: values.author,
    description: values.description,
    status: values.status,
  })
  return response.data
}

export const deleteBook = async (id: number) => {
  const response = await requestHandler.delete<void>(bookService.deleteBook(id))
  return response.data
}
