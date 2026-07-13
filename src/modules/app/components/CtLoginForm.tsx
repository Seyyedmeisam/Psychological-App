import { FormProvider } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtTextInput } from '@/modules/app/components/forms'
import { useLoginForm } from '@/modules/app/hooks'
import { Alert, AlertDescription, AlertTitle } from '@/modules/app/components/ui/alert'
import { Button } from '@/modules/app/components/ui/button'
import { Spinner } from '@/modules/app/components/ui/spinner'

export function CtLoginForm() {
  const { form, onSubmit, isPending, error } = useLoginForm()

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>{m.auth_login_failed()}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}
        <CtTextInput
          name="mobile"
          label={m.auth_mobile_label()}
          rules={{ required: m.auth_mobile_required() }}
          inputMode="tel"
          autoComplete="tel"
        />
        <CtTextInput
          name="password"
          label={m.auth_password_label()}
          type="password"
          rules={{ required: m.auth_password_required() }}
          autoComplete="current-password"
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner className="size-4" /> : null}
          {m.auth_login()}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {m.auth_no_account()}{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            {m.auth_register()}
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}
