import { FormProvider, useForm } from 'react-hook-form'
import { CtSelect, CtTextArea, CtTextInput } from '@/modules/app/components/forms'
import { Button } from '@/modules/app/components/ui/button'
import { Spinner } from '@/modules/app/components/ui/spinner'
import type { BookFormValues } from '@/modules/book/types'

type CtBookFormProps = {
  defaultValues?: BookFormValues
  onSubmit: (values: BookFormValues) => void
  isPending?: boolean
}

export function CtBookForm({
  defaultValues,
  onSubmit,
  isPending = false,
}: CtBookFormProps) {
  const form = useForm<BookFormValues>({
    defaultValues: defaultValues ?? {
      title: '',
      author: '',
      description: '',
      status: 'draft',
      cover: null,
    },
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-lg flex-col gap-4"
      >
        <CtTextInput<BookFormValues>
          name="title"
          label="Title"
          rules={{ required: 'Title is required' }}
        />
        <CtTextInput<BookFormValues>
          name="author"
          label="Author"
          rules={{ required: 'Author is required' }}
        />
        <CtTextArea<BookFormValues> name="description" label="Description" rows={4} />
        <CtSelect<BookFormValues>
          name="status"
          label="Status"
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ]}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="size-4" /> : null}
          Save
        </Button>
      </form>
    </FormProvider>
  )
}
