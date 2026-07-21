import { useState } from 'react'
import { CheckCircle2, FileText, XCircle } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAsyncContent } from '@/modules/app/components/feedback/CtAsyncContent'
import { CtButton } from '@/modules/app/components/CtButton'
import { CtPageIntro } from '@/modules/app/components/CtPageIntro'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { CtTextarea } from '@/modules/app/components/CtTextarea'
import {
  CtSelectContent,
  CtSelectItem,
  CtSelectRoot,
  CtSelectTrigger,
  CtSelectValue,
} from '@/modules/app/components/CtSelectParts'
import {
  useAdminMentorVerifications,
  useApproveMentorVerification,
  useRejectMentorVerification,
} from '@/modules/appointment/hooks'
import type { MentorVerificationStatus } from '@/modules/auth/types'
import { cn } from '@/lib/utils'

function statusLabel(status: MentorVerificationStatus | null | undefined) {
  if (status === 'approved') return m.mentor_verification_status_approved()
  if (status === 'rejected') return m.mentor_verification_status_rejected()
  return m.mentor_verification_status_pending()
}

export default function MentorVerificationsPage() {
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'approved' | 'rejected' | 'all'
  >('pending')
  const [rejectNotes, setRejectNotes] = useState<Record<number, string>>({})

  const listQuery = useAdminMentorVerifications(statusFilter)
  const approveMutation = useApproveMentorVerification()
  const rejectMutation = useRejectMentorVerification()

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 ios-slide-up">
      <CtPageIntro
        className="mb-6"
        title={m.admin_mentor_verification_title()}
        description={m.admin_mentor_verification_subtitle()}
        action={
          <CtSelectRoot
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as typeof statusFilter)
            }
          >
            <CtSelectTrigger className="w-44">
              <CtSelectValue />
            </CtSelectTrigger>
            <CtSelectContent>
              <CtSelectItem value="pending">
                {m.mentor_verification_status_pending()}
              </CtSelectItem>
              <CtSelectItem value="approved">
                {m.mentor_verification_status_approved()}
              </CtSelectItem>
              <CtSelectItem value="rejected">
                {m.mentor_verification_status_rejected()}
              </CtSelectItem>
              <CtSelectItem value="all">
                {m.admin_mentor_verification_filter_all()}
              </CtSelectItem>
            </CtSelectContent>
          </CtSelectRoot>
        }
      />

      <CtAsyncContent
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage={listQuery.error?.message}
      >
        {(listQuery.data?.length ?? 0) === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            {m.admin_mentor_verification_empty()}
          </p>
        ) : (
          <div className="space-y-4">
            {listQuery.data?.map((item) => {
              const status = item.user.mentor_verification_status
              const busy =
                (approveMutation.isPending &&
                  approveMutation.variables === item.user.id) ||
                (rejectMutation.isPending &&
                  rejectMutation.variables?.userId === item.user.id)

              return (
                <article
                  key={item.user.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-ios-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        {item.user.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground" dir="ltr">
                        {item.user.mobile}
                      </p>
                      {item.expertise.length > 0 ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {item.expertise.map((area) => area.name).join(' · ')}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {m.admin_mentor_verification_no_expertise()}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                        status === 'approved' &&
                          'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                        status === 'rejected' &&
                          'bg-destructive/15 text-destructive',
                        status !== 'approved' &&
                          status !== 'rejected' &&
                          'bg-amber-500/15 text-amber-800 dark:text-amber-200',
                      )}
                    >
                      {statusLabel(status)}
                    </span>
                  </div>

                  {item.evidences.length === 0 ? (
                    <p className="mt-4 rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                      {m.mentor_verification_empty()}
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {item.evidences.map((evidence) => (
                        <li key={evidence.id}>
                          <a
                            href={evidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-sm font-medium text-foreground underline-offset-2 hover:underline"
                          >
                            <FileText className="size-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                              {evidence.original_name}
                              {evidence.area_of_expertise
                                ? ` · ${evidence.area_of_expertise.name}`
                                : ''}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {status === 'pending' ? (
                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                      <CtTextarea
                        value={rejectNotes[item.user.id] ?? ''}
                        onChange={(event) =>
                          setRejectNotes((prev) => ({
                            ...prev,
                            [item.user.id]: event.target.value,
                          }))
                        }
                        placeholder={m.admin_mentor_verification_reject_note()}
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2">
                        <CtButton
                          type="button"
                          size="sm"
                          disabled={busy || item.evidences.length === 0}
                          onClick={() =>
                            approveMutation.mutate(item.user.id)
                          }
                        >
                          {busy && approveMutation.isPending ? (
                            <CtSpinner className="size-4" />
                          ) : (
                            <CheckCircle2 className="size-4" />
                          )}
                          {m.admin_mentor_verification_approve()}
                        </CtButton>
                        <CtButton
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={busy}
                          onClick={() =>
                            rejectMutation.mutate({
                              userId: item.user.id,
                              note: rejectNotes[item.user.id],
                            })
                          }
                        >
                          {busy && rejectMutation.isPending ? (
                            <CtSpinner className="size-4" />
                          ) : (
                            <XCircle className="size-4" />
                          )}
                          {m.admin_mentor_verification_reject()}
                        </CtButton>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </CtAsyncContent>
    </section>
  )
}
