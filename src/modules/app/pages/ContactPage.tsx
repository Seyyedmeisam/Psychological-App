import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  CtCard,
  CtCardDescription,
  CtCardHeader,
  CtCardTitle,
} from '@/modules/app/components/CtCard'

const CONTACT_HERO =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    altKey: 'contact_gallery_1_alt' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    altKey: 'contact_gallery_2_alt' as const,
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80',
    altKey: 'contact_gallery_3_alt' as const,
  },
] as const

const MAP_EMBED =
  'https://maps.google.com/maps?q=Tehran%2C%20Iran&t=&z=13&ie=UTF8&iwloc=&output=embed'

export default function ContactPage() {
  const phone = m.contact_phone_value()
  const email = m.contact_email_value()

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative isolate min-h-[min(52vh,28rem)] overflow-hidden border-b border-border">
        <img
          src={CONTACT_HERO}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-center motion-safe:animate-[login-kenburns_24s_ease-out_forwards]"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-foreground/80 via-foreground/45 to-foreground/20" />
        <div className="mx-auto flex min-h-[min(52vh,28rem)] w-full max-w-6xl items-end px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl text-start">
            <p className="text-sm font-semibold tracking-wide text-primary-foreground/90">
              {m.app_name()}
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              {m.contact_title()}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              {m.contact_subtitle()}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CtCard className="home-card-lift home-card-lift-hover border border-border/70">
            <CtCardHeader>
              <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Phone className="size-5" aria-hidden />
              </div>
              <CtCardTitle className="text-base">{m.contact_phone_label()}</CtCardTitle>
              <CtCardDescription>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="font-medium text-foreground hover:text-primary"
                  dir="ltr"
                >
                  {phone}
                </a>
              </CtCardDescription>
            </CtCardHeader>
          </CtCard>

          <CtCard className="home-card-lift home-card-lift-hover border border-border/70">
            <CtCardHeader>
              <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Mail className="size-5" aria-hidden />
              </div>
              <CtCardTitle className="text-base">{m.contact_email_label()}</CtCardTitle>
              <CtCardDescription>
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-foreground hover:text-primary"
                  dir="ltr"
                >
                  {email}
                </a>
              </CtCardDescription>
            </CtCardHeader>
          </CtCard>

          <CtCard className="home-card-lift home-card-lift-hover border border-border/70 sm:col-span-2 lg:col-span-1">
            <CtCardHeader>
              <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <MapPin className="size-5" aria-hidden />
              </div>
              <CtCardTitle className="text-base">{m.contact_address_label()}</CtCardTitle>
              <CtCardDescription className="leading-relaxed">
                {m.contact_address_value()}
              </CtCardDescription>
            </CtCardHeader>
          </CtCard>

          <CtCard className="home-card-lift home-card-lift-hover border border-border/70 sm:col-span-2 lg:col-span-1">
            <CtCardHeader>
              <div className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Clock3 className="size-5" aria-hidden />
              </div>
              <CtCardTitle className="text-base">{m.contact_hours_label()}</CtCardTitle>
              <CtCardDescription className="leading-relaxed whitespace-pre-line">
                {m.contact_hours_value()}
              </CtCardDescription>
            </CtCardHeader>
          </CtCard>
        </div>
      </section>

      <section className="border-b border-border bg-card px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.contact_location_title()}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {m.contact_location_body()}
            </p>
            <p className="mt-5 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm leading-relaxed text-foreground">
              <span className="font-semibold">{m.contact_address_label()}: </span>
              {m.contact_address_value()}
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-ios-md">
            <iframe
              title={m.contact_map_title()}
              src={MAP_EMBED}
              className="h-72 w-full border-0 sm:h-80 lg:h-full lg:min-h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl text-start">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.contact_gallery_title()}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              {m.contact_gallery_subtitle()}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {GALLERY.map((item) => (
              <figure
                key={item.src}
                className="group overflow-hidden rounded-2xl border border-border/70 shadow-ios-sm"
              >
                <img
                  src={item.src}
                  alt={m[item.altKey]()}
                  className="aspect-4/3 size-full object-cover transition-transform duration-700 ease-(--motion-ease-out) group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
