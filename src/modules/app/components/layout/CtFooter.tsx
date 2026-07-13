import { m } from '@/core/i18n/paraglide/messages.js'

export function CtFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
        {m.footer_copyright({
          year: String(new Date().getFullYear()),
          appName: m.app_name(),
        })}
      </div>
    </footer>
  )
}
