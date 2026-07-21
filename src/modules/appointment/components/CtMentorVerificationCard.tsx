import { useRef, useState } from 'react'
import { FileText, Trash2, Upload } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import {
  CtAlert,
  CtAlertDescription,
  CtAlertTitle,
} from '@/modules/app/components/CtAlert'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import {
  useAreasOfExpertise,
  useDeleteMentorEvidence,
  useMyMentorVerification,
  useUploadMentorEvidence,
} from '@/modules/appointment/hooks'
import type { MentorVerificationStatus } from '@/modules/auth/types'
import { cn } from '@/lib/utils'

const MAX_BYTES = 5 * 1024 * 1024

function statusTone(status: MentorVerificationStatus | null | undefined) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'default'
}

function statusLabel(status: MentorVerificationStatus | null | undefined) {
  if (status === 'approved') return m.mentor_verification_status_approved()
  if (status === 'rejected') return m.mentor_verification_status_rejected()
  return m.mentor_verification_status_pending()
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function CtMentorVerificationCard() {
  const verificationQuery = useMyMentorVerification()
  const areasQuery = useAreasOfExpertise()
  const uploadMutation = useUploadMentorEvidence()
  const deleteMutation = useDeleteMentorEvidence()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [areaId, setAreaId] = useState<string>('none')
  const [fileError, setFileError] = useState<string | null>(null)

  const status = verificationQuery.data?.status ?? null
  const canUpload = status !== 'approved'
  const evidences = verificationQuery.data?.evidences ?? []

  const onPickFile = () => {
    setFileError(null)
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.size > MAX_BYTES) {
      setFileError(m.mentor_verification_file_too_large())
      return
    }

    uploadMutation.mutate({
      file,
      area_of_expertise_id: areaId === 'none' ? null : Number(areaId),
    })
  }

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card px-4 py-4 shadow-ios-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {m.mentor_verification_title()}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {m.mentor_verification_hint()}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
            statusTone(status) === 'success' &&
              'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
            statusTone(status) === 'danger' &&
              'bg-destructive/15 text-destructive',
            statusTone(status) === 'default' &&
              'bg-amber-500/15 text-amber-800 dark:text-amber-200',
          )}
        >
          {statusLabel(status)}
        </span>
      </div>

      {status === 'rejected' && verificationQuery.data?.note ? (
        <CtAlert variant="destructive" className="mt-4">
          <CtAlertTitle>{m.mentor_verification_rejected_title()}</CtAlertTitle>
          <CtAlertDescription>{verificationQuery.data.note}</CtAlertDescription>
        </CtAlert>
      ) : null}

      {status === 'approved' ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {m.mentor_verification_approved_body()}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {m.mentor_verification_area_optional()}
              </label>
              <CtSelectRoot value={areaId} onValueChange={setAreaId}>
                <CtSelectTrigger className="w-full">
                  <CtSelectValue
                    placeholder={m.mentor_verification_area_optional()}
                  />
                </CtSelectTrigger>
                <CtSelectContent>
                  <CtSelectItem value="none">
                    {m.mentor_verification_area_none()}
                  </CtSelectItem>
                  {(areasQuery.data ?? []).map((area) => (
                    <CtSelectItem key={area.id} value={String(area.id)}>
                      {area.name}
                    </CtSelectItem>
                  ))}
                </CtSelectContent>
              </CtSelectRoot>
            </div>
            <CtButton
              type="button"
              size="sm"
              onClick={onPickFile}
              disabled={!canUpload || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <CtSpinner className="size-4" />
              ) : (
                <Upload className="size-4" />
              )}
              {m.mentor_verification_upload()}
            </CtButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={onFileChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {m.mentor_verification_file_hint()}
          </p>
          {fileError ? (
            <p className="text-xs text-destructive">{fileError}</p>
          ) : null}
        </div>
      )}

      {verificationQuery.isLoading ? (
        <div className="mt-4 flex justify-center py-4">
          <CtSpinner />
        </div>
      ) : evidences.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {evidences.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex items-start gap-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-sm font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {item.original_name}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.size)}
                    {item.area_of_expertise
                      ? ` · ${item.area_of_expertise.name}`
                      : ''}
                  </p>
                </div>
              </div>
              {canUpload ? (
                <CtButton
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(item.id)}
                  aria-label={m.mentor_verification_delete()}
                >
                  <Trash2 className="size-4 text-destructive" />
                </CtButton>
              ) : null}
            </li>
          ))}
        </ul>
      ) : status !== 'approved' ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
          {m.mentor_verification_empty()}
        </p>
      ) : null}
    </div>
  )
}
