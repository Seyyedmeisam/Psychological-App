import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtTable,
  CtTableBody,
  CtTableCell,
  CtTableHead,
  CtTableHeader,
  CtTableRow,
} from '@/modules/app/components/widgets/table/CtTable'
import { useBooks } from '@/modules/book/hooks'

export default function BooksListPage() {
  const { data, isLoading, isError, error } = useBooks()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 ios-slide-up">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{m.books_title()}</h1>
        <CtButton asChild>
          <Link to="/books/upsert">{m.books_add()}</Link>
        </CtButton>
      </div>
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {(data ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            {m.books_empty()}
          </p>
        ) : (
          <CtTable>
            <CtTableHeader>
              <CtTableRow>
                <CtTableHead>{m.book_title_label()}</CtTableHead>
                <CtTableHead>{m.book_author_label()}</CtTableHead>
                <CtTableHead className="w-28 text-end">
                  <span className="sr-only">{m.books_view()}</span>
                </CtTableHead>
              </CtTableRow>
            </CtTableHeader>
            <CtTableBody>
              {(data ?? []).map((book) => (
                <CtTableRow key={book.id}>
                  <CtTableCell className="font-medium">{book.title}</CtTableCell>
                  <CtTableCell className="text-muted-foreground">{book.author}</CtTableCell>
                  <CtTableCell className="text-end">
                    <CtButton asChild variant="tinted" size="sm">
                      <Link to="/books/$bookId" params={{ bookId: String(book.id) }}>
                        {m.books_view()}
                      </Link>
                    </CtButton>
                  </CtTableCell>
                </CtTableRow>
              ))}
            </CtTableBody>
          </CtTable>
        )}
      </CtAsyncContent>
    </section>
  )
}
