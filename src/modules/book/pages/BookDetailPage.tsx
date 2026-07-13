import { Link, useParams } from '@tanstack/react-router'
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
import { useBook } from '@/modules/book/hooks'

export default function BookDetailPage() {
  const { bookId } = useParams({ from: '/_panel/books/$bookId/' })
  const id = Number(bookId)
  const { data, isLoading, isError, error } = useBook(id)

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <CtAsyncContent
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      >
        {data ? (
          <Card>
            <CardHeader>
              <CardTitle>{data.title}</CardTitle>
              <CardAction>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/books/upsert/$bookId" params={{ bookId: String(id) }}>
                      {m.book_edit()}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/books">{m.nav_books()}</Link>
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 text-sm">
                <div className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-medium text-muted-foreground">{m.book_author_label()}</dt>
                  <dd>{data.author}</dd>
                </div>
                <div className="grid gap-1 border-b border-border pb-3">
                  <dt className="font-medium text-muted-foreground">{m.book_status_label()}</dt>
                  <dd>
                    {data.status === 'published'
                      ? m.book_status_published()
                      : m.book_status_draft()}
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">
                    {m.book_description_label()}
                  </dt>
                  <dd>{data.description || '—'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ) : null}
      </CtAsyncContent>
    </section>
  )
}
