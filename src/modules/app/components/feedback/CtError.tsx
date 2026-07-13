import { AlertCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { Alert, AlertDescription, AlertTitle } from '@/modules/app/components/ui/alert'

export function CtError({ message }: { message?: string }) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{m.common_error_title()}</AlertTitle>
        <AlertDescription>{message ?? m.common_error_description()}</AlertDescription>
      </Alert>
    </div>
  )
}
