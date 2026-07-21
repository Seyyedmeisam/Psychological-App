import { Controller, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { CtLabel } from '@/modules/app/components/CtLabel'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import { cn } from '@/lib/utils'

type SelectOption = {
  value: string
  label: string
}

type CtSelectProps<T extends FieldValues> = {
  name: FieldPath<T>
  label?: string
  rules?: RegisterOptions<T, FieldPath<T>>
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export function CtSelect<T extends FieldValues>({
  name,
  label,
  rules,
  options,
  placeholder,
  className,
}: CtSelectProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-2', className)}>
          {label ? <CtLabel>{label}</CtLabel> : null}
          <CtSelectRoot value={field.value ?? ''} onValueChange={field.onChange}>
            <CtSelectTrigger className="w-full" aria-invalid={Boolean(fieldState.error)}>
              <CtSelectValue placeholder={placeholder ?? label} />
            </CtSelectTrigger>
            <CtSelectContent>
              {options.map((option) => (
                <CtSelectItem key={option.value} value={option.value}>
                  {option.label}
                </CtSelectItem>
              ))}
            </CtSelectContent>
          </CtSelectRoot>
          {fieldState.error ? (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
