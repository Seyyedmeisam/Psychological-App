const BASE = '/books'

export const bookService = {
  getBooks: () => BASE,
  getBookById: (id: number | string) => `${BASE}/${id}`,
  createBook: () => BASE,
  updateBook: (id: number | string) => `${BASE}/${id}`,
  deleteBook: (id: number | string) => `${BASE}/${id}`,
}
