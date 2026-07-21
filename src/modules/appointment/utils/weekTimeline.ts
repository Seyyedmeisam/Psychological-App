import type { AvailableSlot } from '@/modules/appointment/types'

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayIso(): string {
  return toLocalIsoDate(new Date())
}

export function getWeekStartIso(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const offset = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + offset)
  return toLocalIsoDate(d)
}

export function addDaysIso(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  d.setDate(d.getDate() + days)
  return toLocalIsoDate(d)
}

export function getWeekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDaysIso(weekStart, index))
}

export function getWeekEndIso(weekStart: string): string {
  return addDaysIso(weekStart, 6)
}

/** API `from` must not be before today; controller still skips past days in results. */
export function getSlotQueryRange(weekStart: string): { from: string; to: string } {
  const today = todayIso()
  const from = weekStart < today ? today : weekStart
  return { from, to: getWeekEndIso(weekStart) }
}

export function isSameSlot(a: AvailableSlot, b: AvailableSlot | null): boolean {
  if (!b) return false
  return (
    a.mentor_id === b.mentor_id &&
    a.date === b.date &&
    a.start_time === b.start_time
  )
}

export function groupSlotsForTimeline(slots: AvailableSlot[]) {
  const timeSet = new Set<string>()
  const byDateTime = new Map<string, AvailableSlot[]>()

  for (const slot of slots) {
    timeSet.add(slot.start_time)
    const key = `${slot.date}|${slot.start_time}`
    const list = byDateTime.get(key) ?? []
    list.push(slot)
    byDateTime.set(key, list)
  }

  const times = Array.from(timeSet).sort((a, b) => a.localeCompare(b))

  return { times, byDateTime }
}
