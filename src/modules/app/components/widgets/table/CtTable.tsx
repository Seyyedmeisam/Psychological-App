import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CtGroup } from '@/modules/app/components/surface/CtGroup'
import { CtSurface } from '@/modules/app/components/surface/CtSurface'
import { Table, TableCaption } from '@/modules/app/components/ui/table'

type CtTableProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly title?: string
  readonly description?: string
  readonly caption?: string
  readonly grouped?: boolean
}

function CtTable({
  children,
  className,
  title,
  description,
  caption,
  grouped = true,
}: CtTableProps) {
  const table = (
    <Table className={cn(grouped && '[&_tr]:border-border/80')}>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      {children}
    </Table>
  )

  return (
    <CtSurface title={title} description={description} className={className}>
      {grouped ? <CtGroup>{table}</CtGroup> : table}
    </CtSurface>
  )
}

export { CtTable }

export {
  TableBody as CtTableBody,
  TableCell as CtTableCell,
  TableFooter as CtTableFooter,
  TableHead as CtTableHead,
  TableHeader as CtTableHeader,
  TableRow as CtTableRow,
} from '@/modules/app/components/ui/table'
