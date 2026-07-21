import { m } from '@/core/i18n/paraglide/messages.js'
import { CtRegisterForm } from '@/modules/auth/components/CtRegisterForm'

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 ios-slide-up">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="text-center lg:text-start">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {m.auth_register_title()}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{m.auth_register_subtitle()}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{m.home_description()}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CtRegisterForm />
        </div>
      </div>
    </section>
  )
}
