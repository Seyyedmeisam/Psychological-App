import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type SidebarContextValue = {
  isMobileOpen: boolean
  setMobileOpen: (next: boolean) => void
  isCollapsed: boolean
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function CtSidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isMobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setCollapsed] = useState(false)

  const value = useMemo<SidebarContextValue>(
    () => ({
      isMobileOpen,
      setMobileOpen,
      isCollapsed,
      toggleCollapsed: () => setCollapsed((v) => !v),
    }),
    [isMobileOpen, isCollapsed],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within CtSidebarProvider')
  return ctx
}

