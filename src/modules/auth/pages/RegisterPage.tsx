import { m } from '@/core/i18n/paraglide/messages.js'
import { CtRegisterForm } from '@/modules/auth/components/CtRegisterForm'

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10 ios-slide-up">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">{m.auth_register_title()}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{m.auth_register_subtitle()}</p>
      </div>
      <CtRegisterForm />
    </section>
  )
}
