import { useMemo } from 'react'
import { getLocale } from '@/core/i18n/paraglide/runtime.js'
import { m } from '@/core/i18n/paraglide/messages.js'
import { cn } from '@/lib/utils'
import type { AvailableSlot } from '@/modules/appointment/types'
import {
  getWeekDates,
  groupSlotsForTimeline,
  isSameSlot,
  todayIso,
} from '@/modules/appointment/utils/weekTimeline'

type CtAppointmentWeekTimelineProps = {
  weekStart: string
  slots: AvailableSlot[]
  selectedSlot: AvailableSlot | null
  onSelect: (slot: AvailableSlot) => void
}

function formatDayHeader(date: string) {
  const label = new Intl.DateTimeFormat(getLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))

  return label
}

export function CtAppointmentWeekTimeline({
  weekStart,
  slots,
  selectedSlot,
  onSelect,
}: Readonly<CtAppointmentWeekTimelineProps>) {
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart])
  const { times, byDateTime } = useMemo(() => groupSlotsForTimeline(slots), [slots])
  const today = todayIso()

  if (times.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {m.appointment_no_slots()}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-ios-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/60">
            <th className="sticky inset-s-0 z-10 min-w-28 bg-secondary/60 px-3 py-3 text-start font-semibold text-muted-foreground">
              {m.schedule_time()}
            </th>
            {weekDates.map((date) => {
              const isToday = date === today
              return (
                <th
                  key={date}
                  className={cn(
                    'min-w-24 px-2 py-3 text-center font-semibold',
                    isToday ? 'text-primary' : 'text-foreground',
                  )}
                >
                  <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                    {formatDayHeader(date)}
                  </span>
                  {isToday ? (
                    <span className="mt-0.5 block text-[0.65rem] font-semibold text-primary">
                      {m.appointment_today()}
                    </span>
                  ) : null}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {times.map((startTime, rowIndex) => {
            const endTime = slots.find((slot) => slot.start_time === startTime)?.end_time

            return (
              <tr
                key={startTime}
                className={cn(
                  'border-b border-border/70',
                  rowIndex % 2 === 0 ? 'bg-card' : 'bg-secondary/15',
                )}
              >
                <td className="sticky inset-s-0 z-10 bg-inherit px-3 py-2 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {startTime}
                      {endTime ? ` – ${endTime}` : ''}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {m.schedule_session_meta()}
                    </span>
                  </div>
                </td>
                {weekDates.map((date) => {
                  const cellSlots = byDateTime.get(`${date}|${startTime}`) ?? []

                  return (
                    <td key={`${date}-${startTime}`} className="px-1.5 py-1.5 align-top">
                      {cellSlots.length === 0 ? (
                        <div
                          className="flex h-14 items-center justify-center rounded-xl border border-transparent bg-transparent"
                          aria-hidden
                        />
                      ) : (
                        <div className="flex min-h-14 flex-col gap-1">
                          {cellSlots.map((slot) => {
                            const active = isSameSlot(slot, selectedSlot)
                            return (
                              <button
                                key={`${slot.mentor_id}-${slot.date}-${slot.start_time}`}
                                type="button"
                                onClick={() => onSelect(slot)}
                                aria-pressed={active}
                                className={cn(
                                  'ios-press flex min-h-14 w-full flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-center transition-colors',
                                  active
                                    ? 'border-primary/40 bg-primary text-primary-foreground shadow-sm'
                                    : 'border-border/80 bg-background/80 text-foreground hover:border-primary/30 hover:bg-accent hover:text-accent-foreground',
                                )}
                              >
                                <span className="line-clamp-2 text-xs font-semibold leading-tight">
                                  {slot.mentor_name}
                                </span>
                                <span className="mt-0.5 text-[0.65rem] font-medium opacity-80">
                                  {active
                                    ? m.appointment_slot_selected()
                                    : m.appointment_select_slot()}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
