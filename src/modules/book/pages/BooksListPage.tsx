import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { Button } from '@/modules/app/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/app/components/ui/card'
import { useBooks } from '@/modules/book/hooks'

export default function BooksListPage() {
  const { data, isLoading, isError, error } = useBooks()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">{m.books_title()}</h1>
        <Button asChild>
          <Link to="/books/upsert">{m.books_add()}</Link>
        </Button>
      </div>
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {(data ?? []).length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            {m.books_empty()}
          </p>
        ) : (
          <div className="grid gap-4">
            {(data ?? []).map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardAction>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/books/$bookId" params={{ bookId: String(book.id) }}>
                        {m.books_view()}
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{book.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CtAsyncContent>
    </section>
  )
}
