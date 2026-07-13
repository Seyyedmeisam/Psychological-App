import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-24 w-full rounded-xl border border-transparent bg-input px-4 py-3 text-base shadow-none transition-[background-color,box-shadow,border-color] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-45 md:text-sm',
        'focus-visible:border-ring/30 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/25',
        'aria-invalid:border-destructive/40 aria-invalid:bg-destructive/5 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
