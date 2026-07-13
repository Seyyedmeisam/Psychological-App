import { FormProvider } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtSelect, CtTextInput } from '@/modules/app/components/forms'
import { useRegisterForm } from '@/modules/app/hooks'
import { Alert, AlertDescription, AlertTitle } from '@/modules/app/components/ui/alert'
import { Button } from '@/modules/app/components/ui/button'
import { Spinner } from '@/modules/app/components/ui/spinner'

export function CtRegisterForm() {
  const { form, onSubmit, isPending, error } = useRegisterForm()

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{m.auth_register_failed()}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}
        <CtTextInput
          name="name"
          label={m.auth_name_label()}
          rules={{ required: m.auth_name_required() }}
          autoComplete="name"
        />
        <CtTextInput
          name="mobile"
          label={m.auth_mobile_label()}
          rules={{ required: m.auth_mobile_required() }}
          inputMode="tel"
          autoComplete="tel"
        />
        <CtSelect
          name="role"
          label={m.auth_role_label()}
          options={[
            { value: 'user', label: m.auth_role_user() },
            { value: 'mentor', label: m.auth_role_mentor() },
          ]}
        />
        <CtTextInput
          name="password"
          label={m.auth_password_label()}
          type="password"
          rules={{
            required: m.auth_password_required(),
            minLength: { value: 8, message: m.auth_password_min() },
          }}
          autoComplete="new-password"
        />
        <CtTextInput
          name="password_confirmation"
          label={m.auth_password_confirm_label()}
          type="password"
          rules={{ required: m.auth_password_confirm_required() }}
          autoComplete="new-password"
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner className="size-4" /> : null}
          {m.auth_register()}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {m.auth_have_account()}{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            {m.auth_login()}
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}
