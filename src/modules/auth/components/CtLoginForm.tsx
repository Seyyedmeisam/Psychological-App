import { FormProvider } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtTextInput } from '@/modules/app/components/forms'
import { useLoginForm } from '@/modules/auth/hooks'
import { CtAlert, CtAlertDescription, CtAlertTitle } from '@/modules/app/components/CtAlert'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'

export function CtLoginForm() {
  const { form, onSubmit, isPending, error } = useLoginForm()

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
        {error ? (
          <CtAlert variant="destructive">
            <AlertCircle />
            <CtAlertTitle>{m.auth_login_failed()}</CtAlertTitle>
            <CtAlertDescription>{error.message}</CtAlertDescription>
          </CtAlert>
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
        <CtButton type="submit" disabled={isPending} className="w-full">
          {isPending ? <CtSpinner className="size-4" /> : null}
          {m.auth_login()}
        </CtButton>
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
