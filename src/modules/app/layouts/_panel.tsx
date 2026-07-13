import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_panel')({
  component: lazy(() => import('@/modules/app/layouts/CtPanelLayout')),
})
