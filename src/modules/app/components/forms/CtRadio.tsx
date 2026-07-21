import { Controller, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { CtLabel } from '@/modules/app/components/CtLabel'
import { CtRadioGroup, CtRadioGroupItem } from '@/modules/app/components/CtRadioGroup'
import { cn } from '@/lib/utils'

type RadioOption = {
  value: string
  label: string
}

type CtRadioProps<T extends FieldValues> = {
  name: FieldPath<T>
  label?: string
  rules?: RegisterOptions<T, FieldPath<T>>
  options: RadioOption[]
  className?: string
}

export function CtRadio<T extends FieldValues>({
  name,
  label,
  rules,
  options,
  className,
}: CtRadioProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-2', className)}>
          {label ? <CtLabel>{label}</CtLabel> : null}
          <CtRadioGroup value={field.value} onValueChange={field.onChange}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <CtRadioGroupItem value={option.value} id={`${String(name)}-${option.value}`} />
                <CtLabel htmlFor={`${String(name)}-${option.value}`} className="font-normal">
                  {option.label}
                </CtLabel>
              </div>
            ))}
          </CtRadioGroup>
          {fieldState.error ? (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
