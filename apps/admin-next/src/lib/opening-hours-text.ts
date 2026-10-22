import type { OpeningHours, OpeningHoursPeriod } from '@repo/lib/schemas/opening-hours'

// Opening hours as the operator reads and types them: one line per group of days with the same ranges, such as
// `Mon-Fri 11:30-15:00, 18:00-22:30`. A close at or before its open means the next day; `Daily` covers the week.

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

// The week as it is read, Monday first.
const displayOrder = [1, 2, 3, 4, 5, 6, 0] as const

function rangeOf(period: OpeningHoursPeriod): string {
  return `${period.openTime}-${period.closeTime}`
}

function dayName(day: number): string {
  return dayNames[day] ?? ''
}

function dayLabel(first: number, last: number): string {
  return first === last ? dayName(first) : `${dayName(first)}-${dayName(last)}`
}

export function formatOpeningHours(hours: OpeningHours): string {
  const rangesByDay = new Map<number, string[]>()
  for (const period of [...hours.periods].sort((a, b) => a.openTime.localeCompare(b.openTime))) {
    rangesByDay.set(period.openDay, [...(rangesByDay.get(period.openDay) ?? []), rangeOf(period)])
  }

  const keyed = displayOrder.map(day => ({ day, key: (rangesByDay.get(day) ?? []).join(', ') }))
  const everyDay = keyed[0]?.key
  if (everyDay !== undefined && everyDay !== '' && keyed.every(entry => entry.key === everyDay)) {
    return `Daily ${everyDay}`
  }

  const lines: string[] = []
  let index = 0
  while (index < keyed.length) {
    const first = keyed[index]
    if (first === undefined) {
      break
    }
    let last = index
    while (keyed[last + 1]?.key === first.key) {
      last += 1
    }
    if (first.key !== '') {
      const lastDay = keyed[last]?.day ?? first.day
      lines.push(`${dayLabel(first.day, lastDay)} ${first.key}`)
    }
    index = last + 1
  }
  return lines.join('\n')
}

export type ParsedOpeningHours
  = | { type: 'ok', hours: OpeningHours }
    | { type: 'bad', message: string }

const timePattern = /^(\d{1,2}):(\d{2})$/

function parseTime(text: string): string | undefined {
  const match = timePattern.exec(text.trim())
  if (match === null) {
    return undefined
  }
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) {
    return undefined
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function parseDay(text: string): number | undefined {
  const lowered = text.trim().toLowerCase()
  if (lowered === '') {
    return undefined
  }
  const index = fullDayNames.findIndex(name => name.startsWith(lowered) && lowered.length >= 3)
  return index === -1 ? undefined : index
}

// `Mon`, `Mon-Fri` (wrapping over the weekend), `Mon, Wed` and `Daily`, in any mix.
function parseDays(text: string): number[] | undefined {
  const days: number[] = []
  for (const part of text.split(',')) {
    const trimmed = part.trim().toLowerCase()
    if (trimmed === 'daily' || trimmed === 'every day' || trimmed === 'everyday') {
      days.push(...displayOrder)
      continue
    }
    const [from, to, extra] = trimmed.split(/\s*[-–]\s*/)
    if (from === undefined || extra !== undefined) {
      return undefined
    }
    const first = parseDay(from)
    const last = to === undefined ? first : parseDay(to)
    if (first === undefined || last === undefined) {
      return undefined
    }
    for (let day = first; ; day = (day + 1) % 7) {
      days.push(day)
      if (day === last) {
        break
      }
    }
  }
  return days
}

export function parseOpeningHours(text: string): ParsedOpeningHours {
  const periods: OpeningHoursPeriod[] = []
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '')
  if (lines.length === 0) {
    return { type: 'bad', message: 'Enter at least one line, such as Mon-Fri 11:30-15:00, 18:00-22:30.' }
  }

  for (const line of lines) {
    const firstDigit = line.search(/\d/)
    if (firstDigit <= 0) {
      return { type: 'bad', message: `Cannot read "${line}": write the days, then the hours.` }
    }
    const days = parseDays(line.slice(0, firstDigit))
    if (days === undefined) {
      return { type: 'bad', message: `Cannot read the days in "${line}": use names like Mon, Mon-Fri or Daily.` }
    }
    for (const range of line.slice(firstDigit).split(',')) {
      const [open, close, extra] = range.split(/\s*[-–]\s*/)
      const openTime = open === undefined ? undefined : parseTime(open)
      const closeTime = close === undefined ? undefined : parseTime(close)
      if (openTime === undefined || closeTime === undefined || extra !== undefined) {
        return { type: 'bad', message: `Cannot read the hours in "${line}": use ranges like 11:30-15:00.` }
      }
      for (const day of days) {
        // A close at or before the open is on the next day: `18:00-02:00`, or `00:00-00:00` for a full day.
        const closeDay = closeTime <= openTime ? (day + 1) % 7 : day
        periods.push({ openDay: day, openTime, closeDay, closeTime })
      }
    }
  }
  return { type: 'ok', hours: { periods } }
}
