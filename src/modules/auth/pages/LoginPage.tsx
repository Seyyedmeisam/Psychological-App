import { m } from '@/core/i18n/paraglide/messages.js'
import { CtLoginForm } from '@/modules/auth/components/CtLoginForm'

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 ios-slide-up">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">{m.auth_login_title()}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{m.auth_login_subtitle()}</p>
      </div>
      <CtLoginForm />
    </section>
  )
}
