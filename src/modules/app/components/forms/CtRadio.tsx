import { Controller, useFormContext } from 'react-hook-form'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { Label } from '@/modules/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/modules/app/components/ui/radio-group'
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
          {label ? <Label>{label}</Label> : null}
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`${String(name)}-${option.value}`} />
                <Label htmlFor={`${String(name)}-${option.value}`} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {fieldState.error ? (
            <p className="text-xs text-destructive">{fieldState.error.message}</p>
          ) : null}
        </div>
      )}
    />
  )
}
