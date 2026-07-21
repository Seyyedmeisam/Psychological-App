import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CtButton } from '@/modules/app/components/CtButton'
import {
  CtTable,
  CtTableBody,
  CtTableCell,
  CtTableHead,
  CtTableHeader,
  CtTableRow,
} from '@/modules/app/components/widgets/table/CtTable'

export type CtDataTableColumn<T> = {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
  /** Value used for CSV export (falls back to text content of cell if omitted). */
  exportValue?: (row: T) => string | number | null | undefined
}

export type CtDataTablePagination = {
  page: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
}

type CtDataTableProps<T> = {
  columns: CtDataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  toolbar?: ReactNode
  emptyMessage?: string
  isFetching?: boolean
  pagination?: CtDataTablePagination
  exportFileName?: string
  exportLabel?: string
  className?: string
  title?: string
  description?: string
}

function escapeCsv(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([`\uFEFF${content}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function exportRowsToCsv<T>(
  columns: CtDataTableColumn<T>[],
  rows: T[],
  fileName: string,
) {
  const headers = columns.map((column) =>
    typeof column.header === 'string' ? column.header : column.id,
  )

  const lines = [
    headers.map((header) => escapeCsv(header)).join(','),
    ...rows.map((row) =>
      columns
        .map((column) => {
          const raw =
            column.exportValue?.(row) ??
            (typeof column.cell(row) === 'string' ||
            typeof column.cell(row) === 'number'
              ? column.cell(row)
              : '')
          return escapeCsv(String(raw ?? ''))
        })
        .join(','),
    ),
  ]

  downloadCsv(fileName, lines.join('\n'))
}

export function CtDataTable<T>({
  columns,
  rows,
  rowKey,
  toolbar,
  emptyMessage = 'No results.',
  isFetching = false,
  pagination,
  exportFileName,
  exportLabel = 'Export',
  className,
  title,
  description,
}: Readonly<CtDataTableProps<T>>) {
  const canExport = Boolean(exportFileName) && rows.length > 0

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {toolbar}
          {isFetching ? (
            <span className="text-sm text-muted-foreground">…</span>
          ) : null}
        </div>
        {canExport ? (
          <CtButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => exportRowsToCsv(columns, rows, exportFileName!)}
          >
            <Download className="size-4" aria-hidden />
            {exportLabel}
          </CtButton>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <CtTable title={title} description={description}>
          <CtTableHeader>
            <CtTableRow>
              {columns.map((column) => (
                <CtTableHead key={column.id} className={column.className}>
                  {column.header}
                </CtTableHead>
              ))}
            </CtTableRow>
          </CtTableHeader>
          <CtTableBody>
            {rows.map((row) => (
              <CtTableRow key={rowKey(row)}>
                {columns.map((column) => (
                  <CtTableCell key={column.id} className={column.className}>
                    {column.cell(row)}
                  </CtTableCell>
                ))}
              </CtTableRow>
            ))}
          </CtTableBody>
        </CtTable>
      )}

      {pagination && pagination.lastPage > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {pagination.total > 0
              ? `${(pagination.page - 1) * pagination.perPage + 1}–${Math.min(
                  pagination.page * pagination.perPage,
                  pagination.total,
                )} / ${pagination.total}`
              : '0'}
          </p>
          <div className="flex items-center gap-2">
            <CtButton
              type="button"
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            </CtButton>
            <span className="min-w-16 text-center text-sm font-medium tabular-nums">
              {pagination.page} / {pagination.lastPage}
            </span>
            <CtButton
              type="button"
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.lastPage}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
            </CtButton>
          </div>
        </div>
      ) : null}
    </div>
  )
}
