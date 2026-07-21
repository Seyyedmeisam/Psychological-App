import {
  CalendarCheck2,
  FilePenLine,
  HeartHandshake,
  KeyRound,
  Scale,
  ShieldAlert,
  Siren,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtLegalDocPage } from '@/modules/app/components/legal/CtLegalDocPage'

const pillars = [
  { label: () => m.terms_pillar_1() },
  { label: () => m.terms_pillar_2() },
  { label: () => m.terms_pillar_3() },
] as const

const sections = [
  {
    id: 'terms-nature',
    icon: HeartHandshake,
    title: () => m.terms_s1_title(),
    body: () => m.terms_s1_body(),
  },
  {
    id: 'terms-accounts',
    icon: KeyRound,
    title: () => m.terms_s2_title(),
    body: () => m.terms_s2_body(),
  },
  {
    id: 'terms-appointments',
    icon: CalendarCheck2,
    title: () => m.terms_s3_title(),
    body: () => m.terms_s3_body(),
  },
  {
    id: 'terms-conduct',
    icon: Scale,
    title: () => m.terms_s4_title(),
    body: () => m.terms_s4_body(),
  },
  {
    id: 'terms-liability',
    icon: ShieldAlert,
    title: () => m.terms_s5_title(),
    body: () => m.terms_s5_body(),
  },
  {
    id: 'terms-changes',
    icon: FilePenLine,
    title: () => m.terms_s6_title(),
    body: () => m.terms_s6_body(),
  },
] as const

const related = [
  {
    to: '/privacy' as const,
    label: () => m.nav_privacy(),
    description: () => m.legal_related_privacy(),
  },
  {
    to: '/faq' as const,
    label: () => m.nav_faq(),
    description: () => m.legal_related_faq(),
  },
  {
    to: '/about' as const,
    label: () => m.nav_about(),
    description: () => m.legal_related_about(),
  },
  {
    to: '/contact' as const,
    label: () => m.nav_contact(),
    description: () => m.legal_related_contact(),
  },
] as const

export default function TermsPage() {
  return (
    <CtLegalDocPage
      variant="terms"
      title={m.terms_title()}
      subtitle={m.terms_subtitle()}
      updated={m.terms_updated()}
      intro={m.terms_intro()}
      highlightTitle={m.terms_highlight_title()}
      highlightBody={m.terms_highlight_body()}
      HighlightIcon={Siren}
      pillars={pillars}
      sections={sections}
      related={related}
    />
  )
}
