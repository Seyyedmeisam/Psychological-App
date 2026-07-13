import { m } from '@/core/i18n/paraglide/messages.js'

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{m.about_title()}</h1>
      <p className="mt-4 text-muted-foreground">{m.about_description()}</p>
    </section>
  )
}
