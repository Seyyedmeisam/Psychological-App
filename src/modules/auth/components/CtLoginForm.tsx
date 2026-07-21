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
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
        {error ? (
          <CtAlert
            variant="destructive"
            className="login-reveal"
            style={{ animationDelay: '0ms' }}
          >
            <AlertCircle />
            <CtAlertTitle>{m.auth_login_failed()}</CtAlertTitle>
            <CtAlertDescription>{error.message}</CtAlertDescription>
          </CtAlert>
        ) : null}

        <div
          className="login-reveal flex flex-col gap-4"
          style={{ animationDelay: '420ms' }}
        >
          <CtTextInput
            name="mobile"
            label={m.auth_mobile_label()}
            rules={{ required: m.auth_mobile_required() }}
            inputMode="tel"
            autoComplete="tel"
            placeholder="09xxxxxxxxx"
          />
          <CtTextInput
            name="password"
            label={m.auth_password_label()}
            type="password"
            rules={{ required: m.auth_password_required() }}
            autoComplete="current-password"
          />
        </div>

        <div className="login-reveal" style={{ animationDelay: '500ms' }}>
          <CtButton
            type="submit"
            size="lg"
            disabled={isPending}
            className="mt-1 w-full transition-transform duration-(--motion-duration-fast) ease-(--motion-ease-out) hover:scale-[1.015] active:scale-[0.985]"
          >
            {isPending ? <CtSpinner className="size-4" /> : null}
            {m.auth_login()}
          </CtButton>
        </div>

        <p
          className="login-reveal text-center text-sm text-muted-foreground"
          style={{ animationDelay: '560ms' }}
        >
          {m.auth_no_account()}{' '}
          <Link
            to="/register"
            className="font-semibold text-primary underline-offset-4 transition-colors duration-(--motion-duration-fast) hover:underline"
          >
            {m.auth_register()}
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}
