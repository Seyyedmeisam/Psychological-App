import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-11 w-full min-w-0 rounded-xl border border-transparent bg-input px-4 py-2 text-base shadow-none transition-[background-color,box-shadow,border-color] outline-none selection:bg-primary/20 selection:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 md:text-sm',
        'focus-visible:border-ring/30 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/25',
        'aria-invalid:border-destructive/40 aria-invalid:bg-destructive/5 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
