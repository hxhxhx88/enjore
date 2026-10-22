import { describe, expect, it } from 'vitest'
import { formatOpeningHours, parseOpeningHours } from '@/lib/opening-hours-text'

describe('formatOpeningHours', () => {
  it('merges consecutive days with the same ranges and lists ranges in order', () => {
    const hours = {
      periods: [
        { openDay: 1, openTime: '18:00', closeDay: 1, closeTime: '22:30' },
        { openDay: 1, openTime: '11:30', closeDay: 1, closeTime: '15:00' },
        { openDay: 2, openTime: '11:30', closeDay: 2, closeTime: '15:00' },
        { openDay: 2, openTime: '18:00', closeDay: 2, closeTime: '22:30' },
        { openDay: 6, openTime: '12:00', closeDay: 6, closeTime: '23:00' },
        { openDay: 0, openTime: '12:00', closeDay: 0, closeTime: '23:00' },
      ],
    }

    expect(formatOpeningHours(hours)).toBe('Mon-Tue 11:30-15:00, 18:00-22:30\nSat-Sun 12:00-23:00')
  })

  it('writes a week of identical days as Daily', () => {
    const periods = [0, 1, 2, 3, 4, 5, 6].map(day => ({ openDay: day, openTime: '00:00', closeDay: (day + 1) % 7, closeTime: '00:00' }))
    expect(formatOpeningHours({ periods })).toBe('Daily 00:00-00:00')
  })

  it('shows a close after midnight as its time', () => {
    expect(formatOpeningHours({ periods: [{ openDay: 5, openTime: '18:00', closeDay: 6, closeTime: '02:00' }] })).toBe('Fri 18:00-02:00')
  })

  it('is empty without periods', () => {
    expect(formatOpeningHours({ periods: [] })).toBe('')
  })
})

describe('parseOpeningHours', () => {
  it('reads day ranges, lists and several ranges per line', () => {
    expect(parseOpeningHours('Mon-Wed 11:30-15:00, 18:00-22:30\nSat, Sun 12:00-23:00')).toEqual({
      type: 'ok',
      hours: {
        periods: [
          { openDay: 1, openTime: '11:30', closeDay: 1, closeTime: '15:00' },
          { openDay: 2, openTime: '11:30', closeDay: 2, closeTime: '15:00' },
          { openDay: 3, openTime: '11:30', closeDay: 3, closeTime: '15:00' },
          { openDay: 1, openTime: '18:00', closeDay: 1, closeTime: '22:30' },
          { openDay: 2, openTime: '18:00', closeDay: 2, closeTime: '22:30' },
          { openDay: 3, openTime: '18:00', closeDay: 3, closeTime: '22:30' },
          { openDay: 6, openTime: '12:00', closeDay: 6, closeTime: '23:00' },
          { openDay: 0, openTime: '12:00', closeDay: 0, closeTime: '23:00' },
        ],
      },
    })
  })

  it('puts a close at or before the open on the next day and pads single-digit hours', () => {
    expect(parseOpeningHours('fri 18:00-2:00')).toEqual({
      type: 'ok',
      hours: { periods: [{ openDay: 5, openTime: '18:00', closeDay: 6, closeTime: '02:00' }] },
    })
    expect(parseOpeningHours('Daily 00:00-00:00').type).toBe('ok')
  })

  it('wraps a day range over the weekend and accepts full names and an en dash', () => {
    const parsed = parseOpeningHours('Saturday–Monday 9:00–17:00')
    expect(parsed.type === 'ok' && parsed.hours.periods.map(period => period.openDay)).toEqual([6, 0, 1])
  })

  it('round-trips the text format', () => {
    const text = 'Mon-Fri 11:30-15:00, 18:00-22:30\nSat 12:00-23:00'
    const parsed = parseOpeningHours(text)
    expect(parsed.type === 'ok' && formatOpeningHours(parsed.hours)).toBe(text)
  })

  it('reports what it cannot read', () => {
    expect(parseOpeningHours('')).toMatchObject({ type: 'bad' })
    expect(parseOpeningHours('11:00-15:00')).toMatchObject({ type: 'bad' })
    expect(parseOpeningHours('Funday 11:00-15:00')).toMatchObject({ type: 'bad' })
    expect(parseOpeningHours('Mon 11:00-25:00')).toMatchObject({ type: 'bad' })
    expect(parseOpeningHours('Mon 11:00')).toMatchObject({ type: 'bad' })
  })
})
