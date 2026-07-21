import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CtButton } from '@/modules/app/components/CtButton'

type CtHomeSliderProps = Readonly<{
  children: ReactNode
  intervalMs?: number
  className?: string
  previousLabel: string
  nextLabel: string
}>

export function CtHomeSlider({
  children,
  intervalMs = 5500,
  className,
  previousLabel,
  nextLabel,
}: CtHomeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const slides = Children.toArray(children)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track || slides.length === 0) return
      const clamped = ((next % slides.length) + slides.length) % slides.length
      const target = track.querySelector<HTMLElement>(`[data-slide-index="${clamped}"]`)
      target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setIndex(clamped)
    },
    [slides.length],
  )

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % slides.length
        const track = trackRef.current
        const target = track?.querySelector<HTMLElement>(
          `[data-slide-index="${next}"]`,
        )
        target?.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest',
        })
        return next
      })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, paused, slides.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | undefined
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        }
        if (!best) return
        const nextIndex = Number(
          (best.target as HTMLElement).dataset.slideIndex ?? 0,
        )
        setIndex(nextIndex)
      },
      { root: track, threshold: 0.55 },
    )

    const nodes = track.querySelectorAll('[data-slide-index]')
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [slides.length])

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false)
        }
      }}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-slide-index={i}
            className="w-[min(100%,22rem)] shrink-0 snap-start sm:w-[min(100%,26rem)]"
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-(--motion-duration-normal) ease-(--motion-ease-out)',
                i === index
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-border hover:bg-muted-foreground/40',
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CtButton
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label={previousLabel}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </CtButton>
          <CtButton
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label={nextLabel}
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </CtButton>
        </div>
      </div>
    </div>
  )
}
