import {
  Database,
  FilePenLine,
  LockKeyhole,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
} from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtLegalDocPage } from '@/modules/app/components/legal/CtLegalDocPage'

const pillars = [
  { label: () => m.privacy_pillar_1() },
  { label: () => m.privacy_pillar_2() },
  { label: () => m.privacy_pillar_3() },
] as const

const sections = [
  {
    id: 'privacy-collect',
    icon: Database,
    title: () => m.privacy_s1_title(),
    body: () => m.privacy_s1_body(),
  },
  {
    id: 'privacy-use',
    icon: Sparkles,
    title: () => m.privacy_s2_title(),
    body: () => m.privacy_s2_body(),
  },
  {
    id: 'privacy-sharing',
    icon: Share2,
    title: () => m.privacy_s3_title(),
    body: () => m.privacy_s3_body(),
  },
  {
    id: 'privacy-security',
    icon: LockKeyhole,
    title: () => m.privacy_s4_title(),
    body: () => m.privacy_s4_body(),
  },
  {
    id: 'privacy-rights',
    icon: UserRoundCog,
    title: () => m.privacy_s5_title(),
    body: () => m.privacy_s5_body(),
  },
  {
    id: 'privacy-changes',
    icon: FilePenLine,
    title: () => m.privacy_s6_title(),
    body: () => m.privacy_s6_body(),
  },
] as const

const related = [
  {
    to: '/terms' as const,
    label: () => m.nav_terms(),
    description: () => m.legal_related_terms(),
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

export default function PrivacyPolicyPage() {
  return (
    <CtLegalDocPage
      variant="privacy"
      title={m.privacy_title()}
      subtitle={m.privacy_subtitle()}
      updated={m.privacy_updated()}
      intro={m.privacy_intro()}
      highlightTitle={m.privacy_highlight_title()}
      highlightBody={m.privacy_highlight_body()}
      HighlightIcon={ShieldCheck}
      pillars={pillars}
      sections={sections}
      related={related}
    />
  )
}
