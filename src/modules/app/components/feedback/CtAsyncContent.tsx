import type { ReactNode } from 'react'
import { CtError } from '@/modules/app/components/feedback/CtError'
import { CtLoading } from '@/modules/app/components/feedback/CtLoading'

type CtAsyncContentProps = {
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  children: ReactNode
}

export function CtAsyncContent({
  isLoading,
  isError,
  errorMessage,
  children,
}: CtAsyncContentProps) {
  if (isLoading) return <CtLoading />
  if (isError) return <CtError message={errorMessage} />
  return children
}
