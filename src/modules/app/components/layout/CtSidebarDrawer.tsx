import { X } from 'lucide-react'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtDialogContent, CtDialogRoot } from '@/modules/app/components/CtDialogParts'
import { CtSidebar } from '@/modules/app/components/layout/CtSidebar'
import { useSidebar } from '@/modules/app/providers/CtSidebarProvider'

export function CtSidebarDrawer() {
  const { isMobileOpen, setMobileOpen } = useSidebar()

  return (
    <CtDialogRoot open={isMobileOpen} onOpenChange={setMobileOpen}>
      <CtDialogContent placement="drawer-start">
        <div className="flex items-center justify-end border-b border-border px-2 py-2">
          <CtButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-4" />
          </CtButton>
        </div>
        <div className="h-[calc(100dvh-3.25rem)]">
          <CtSidebar variant="mobile" />
        </div>
      </CtDialogContent>
    </CtDialogRoot>
  )
}
