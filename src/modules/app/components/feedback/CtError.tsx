import { AlertCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAlert, CtAlertDescription, CtAlertTitle } from '@/modules/app/components/CtAlert'

export function CtError({ message }: { message?: string }) {
  return (
    <div className="p-4">
      <CtAlert variant="destructive">
        <AlertCircle />
        <CtAlertTitle>{m.common_error_title()}</CtAlertTitle>
        <CtAlertDescription>{message ?? m.common_error_description()}</CtAlertDescription>
      </CtAlert>
    </div>
  )
}
