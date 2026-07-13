import { Controller, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { Label } from '@/modules/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/app/components/ui/select'
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
          {label ? <Label>{label}</Label> : null}
          <Select value={field.value ?? ''} onValueChange={field.onChange}>
            <SelectTrigger className="w-full" aria-invalid={Boolean(fieldState.error)}>
              <SelectValue placeholder={placeholder ?? label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error ? (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
