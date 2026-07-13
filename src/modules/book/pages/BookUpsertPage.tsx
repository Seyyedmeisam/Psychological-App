import { FormProvider } from 'react-hook-form'
import { Link, useParams } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtSelect, CtTextArea, CtTextInput } from '@/modules/app/components/forms'
import { Button } from '@/modules/app/components/ui/button'
import { Spinner } from '@/modules/app/components/ui/spinner'
import { useBookUpsertForm } from '@/modules/book/hooks'

export default function BookUpsertPage() {
  const params = useParams({ strict: false })
  const bookId = params.bookId ? Number(params.bookId) : undefined
  const { form, onSubmit, isPending } = useBookUpsertForm(bookId)

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          {bookId ? m.book_edit() : m.book_create()}
        </h1>
        <Button asChild variant="outline">
          <Link to="/books">{m.book_cancel()}</Link>
        </Button>
      </div>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex max-w-lg flex-col gap-4">
          <CtTextInput
            name="title"
            label={m.book_title_label()}
            rules={{ required: m.book_title_required() }}
          />
          <CtTextInput
            name="author"
            label={m.book_author_label()}
            rules={{ required: m.book_author_required() }}
          />
          <CtTextArea name="description" label={m.book_description_label()} rows={4} />
          <CtSelect
            name="status"
            label={m.book_status_label()}
            options={[
              { value: 'draft', label: m.book_status_draft() },
              { value: 'published', label: m.book_status_published() },
            ]}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : null}
            {m.book_save()}
          </Button>
        </form>
      </FormProvider>
    </section>
  )
}
