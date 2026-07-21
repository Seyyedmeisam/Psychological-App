import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { CtAvatar } from '@/modules/app/components/CtAvatar'
import { CtSpinner } from '@/modules/app/components/CtSpinner'
import { cn } from '@/lib/utils'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
const MAX_BYTES = 2 * 1024 * 1024

type CtUserAvatarEditorProps = {
  name: string
  seed: number | string
  src?: string | null
  editable?: boolean
  isPending?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onSelect: (file: File) => void
  className?: string
}

export function CtUserAvatarEditor({
  name,
  seed,
  src,
  editable = true,
  isPending = false,
  size = 'md',
  onSelect,
  className,
}: Readonly<CtUserAvatarEditorProps>) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onPick = () => {
    if (!editable || isPending) return
    inputRef.current?.click()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > MAX_BYTES) {
      window.alert(m.user_avatar_too_large())
      return
    }
    onSelect(file)
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <CtAvatar name={name} seed={seed} src={src} size={size} />
        {editable ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={onChange}
            />
            <button
              type="button"
              onClick={onPick}
              disabled={isPending}
              aria-label={m.auth_profile_change_photo()}
              className={cn(
                'absolute inset-e-0 bottom-0 flex size-8 items-center justify-center rounded-full',
                'border-2 border-card bg-primary text-primary-foreground shadow-ios-sm',
                'transition-transform ios-press hover:brightness-105',
                'disabled:pointer-events-none disabled:opacity-60',
              )}
            >
              {isPending ? (
                <CtSpinner className="size-3.5" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </button>
          </>
        ) : null}
      </div>
      {editable ? (
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {m.user_avatar_label()}
          </p>
          <p className="text-xs text-muted-foreground">
            {m.user_avatar_hint()}
          </p>
        </div>
      ) : null}
    </div>
  )
}
