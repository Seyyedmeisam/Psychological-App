import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import type {
  AvailabilitySlot,
  AvailabilitySlotInput,
  TemplateSlot,
  WeekDay,
} from '@/modules/schedule/types'
import { WEEK_DAYS } from '@/modules/schedule/types'

function slotKey(day: number, start: string) {
  return `${day}|${start}`
}

function dayLabel(day: WeekDay) {
  const labels = [
    m.weekday_mon(),
    m.weekday_tue(),
    m.weekday_wed(),
    m.weekday_thu(),
    m.weekday_fri(),
    m.weekday_sat(),
    m.weekday_sun(),
  ] as const
  return labels[day]
}

type CtWeekScheduleGridProps = {
  templateSlots: TemplateSlot[]
  selected: AvailabilitySlot[]
  onChange: (next: AvailabilitySlotInput[]) => void
  readOnly?: boolean
}

export function CtWeekScheduleGrid({
  templateSlots,
  selected,
  onChange,
  readOnly = false,
}: Readonly<CtWeekScheduleGridProps>) {
  const selectedSet = useMemo(
    () => new Set(selected.map((s) => slotKey(s.day_of_week, s.start_time))),
    [selected],
  )

  const toggle = (day: number, start: string) => {
    if (readOnly) return

    const key = slotKey(day, start)
    const next = new Set(selectedSet)
    if (next.has(key)) next.delete(key)
    else next.add(key)

    onChange(
      Array.from(next).map((item) => {
        const [dayPart, startPart = ''] = item.split('|')
        return {
          day_of_week: Number(dayPart),
          start_time: startPart,
        }
      }),
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-ios-sm">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/60">
            <th className="sticky start-0 z-10 bg-secondary/60 px-3 py-3 text-start font-semibold text-muted-foreground">
              {m.schedule_time()}
            </th>
            {templateSlots.map((slot) => (
              <th
                key={slot.start}
                className="px-2 py-3 text-center font-semibold text-foreground"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span>
                    {slot.start} – {slot.end}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {m.schedule_session_meta()}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEK_DAYS.map((day, index) => (
            <tr
              key={day}
              className={cn(
                'border-b border-border/70',
                index % 2 === 0 ? 'bg-card' : 'bg-secondary/20',
              )}
            >
              <td className="sticky start-0 z-10 bg-inherit px-3 py-2 whitespace-nowrap">
                <span className="font-semibold text-foreground">
                  {dayLabel(day)}
                </span>
              </td>
              {templateSlots.map((slot) => {
                const active = selectedSet.has(slotKey(day, slot.start))
                return (
                  <td key={`${day}-${slot.start}`} className="px-1.5 py-1.5">
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => toggle(day, slot.start)}
                      aria-pressed={active}
                      className={cn(
                        'group relative flex h-14 w-full items-center justify-center rounded-xl border transition-all ios-press',
                        active
                          ? 'border-primary/40 bg-primary text-primary-foreground shadow-sm'
                          : 'border-border/80 bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-accent-foreground',
                        readOnly && 'cursor-default opacity-90',
                      )}
                    >
                      {active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold">
                          <Check className="size-3.5" />
                          {m.schedule_available()}
                        </span>
                      ) : (
                        <span className="text-xs font-medium opacity-70">
                          {m.schedule_unavailable()}
                        </span>
                      )}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function useEditableSlots(initial: AvailabilitySlot[]) {
  const [slots, setSlots] = useState<AvailabilitySlotInput[]>(
    initial.map((s) => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
    })),
  )

  return { slots, setSlots }
}
