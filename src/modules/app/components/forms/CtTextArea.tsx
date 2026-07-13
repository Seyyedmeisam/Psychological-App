import type { ComponentProps } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { Label } from '@/modules/app/components/ui/label'
import { Textarea } from '@/modules/app/components/ui/textarea'
import { cn } from '@/lib/utils'

type CtTextAreaProps<T extends FieldValues> = {
  name: FieldPath<T>
  label?: string
  rules?: RegisterOptions<T, FieldPath<T>>
} & Omit<ComponentProps<typeof Textarea>, 'name' | 'value' | 'onChange' | 'onBlur' | 'ref'>

export function CtTextArea<T extends FieldValues>({
  name,
  label,
  rules,
  className,
  id,
  ...textAreaProps
}: CtTextAreaProps<T>) {
  const { control } = useFormContext<T>()
  const inputId = id ?? String(name)

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          {label ? <Label htmlFor={inputId}>{label}</Label> : null}
          <Textarea
            {...field}
            {...textAreaProps}
            id={inputId}
            aria-invalid={Boolean(fieldState.error)}
            className={cn(className)}
          />
          {fieldState.error ? (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
