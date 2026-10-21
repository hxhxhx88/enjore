import { z } from 'zod'

// A restaurant's regular opening hours, stored as JSON in `restaurants.opening_hours` after normalizing what Google
// Places returns. Days count from Sunday = 0 as Places does; times are 24-hour `HH:MM`. A period that closes after
// midnight has a `closeDay` after its `openDay`.
const weekdaySchema = z.number().int().min(0).max(6)
const timeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)

export const openingHoursPeriodSchema = z.object({
  openDay: weekdaySchema,
  openTime: timeSchema,
  closeDay: weekdaySchema,
  closeTime: timeSchema,
})

export const openingHoursSchema = z.object({
  periods: z.array(openingHoursPeriodSchema),
})

export type OpeningHoursPeriod = z.infer<typeof openingHoursPeriodSchema>
export type OpeningHours = z.infer<typeof openingHoursSchema>
