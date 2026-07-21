import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const SIZE_CLASS = {
  xs: 'size-8 text-[10px]',
  sm: 'size-10 text-xs',
  md: 'size-14 text-sm',
  lg: 'size-24 text-2xl',
  xl: 'size-28 text-3xl',
} as const

type CtAvatarProps = {
  name: string
  seed?: string | number
  src?: string | null
  size?: keyof typeof SIZE_CLASS
  className?: string
  alt?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const second = parts[1] ?? ''
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

function fallbackAvatarUrl(seed: string) {
  const params = new URLSearchParams({
    seed,
    backgroundColor: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    backgroundType: 'gradientLinear',
  })
  return `https://api.dicebear.com/9.x/notionists/svg?${params.toString()}`
}

export function CtAvatar({
  name,
  seed,
  src,
  size = 'md',
  className,
  alt,
}: Readonly<CtAvatarProps>) {
  const [failed, setFailed] = useState(false)
  const imageSrc = src || fallbackAvatarUrl(String(seed ?? name))

  useEffect(() => {
    setFailed(false)
  }, [imageSrc])

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-bold text-primary-foreground shadow-ios-sm ring-4 ring-card',
        SIZE_CLASS[size],
        className,
      )}
    >
      {!failed ? (
        <img
          key={imageSrc}
          src={imageSrc}
          alt={alt ?? name}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <span className="relative z-10">{initials(name)}</span>
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent"
          />
        </>
      )}
    </span>
  )
}
