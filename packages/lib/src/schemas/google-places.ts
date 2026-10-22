import { z } from 'zod'

// What Places API (New) returns for a place, limited to the fields the admin's field masks request
// (`apps/admin-next/src/lib/places/client.ts`). Every field but `id` is optional because the mask decides what comes
// back, and a wider mask needs no schema change. Every response is parsed with these before anything reads it; the
// seven facts the admin keeps are mapped in `apps/admin-next/src/lib/places/map-facts.ts`.
const localizedTextSchema = z.object({
  text: z.string(),
  languageCode: z.string().optional(),
})

const addressComponentSchema = z.object({
  longText: z.string().optional(),
  shortText: z.string().optional(),
  types: z.array(z.string()).default([]),
  languageCode: z.string().optional(),
})

// A point in the week; `day` counts from Sunday = 0. A period that never closes has no `close`.
const openingPointSchema = z.object({
  day: z.number().int().min(0).max(6),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
})

const openingPeriodSchema = z.object({
  open: openingPointSchema,
  close: openingPointSchema.optional(),
})

export const placeSchema = z.object({
  id: z.string().min(1),
  displayName: localizedTextSchema.optional(),
  formattedAddress: z.string().optional(),
  addressComponents: z.array(addressComponentSchema).optional(),
  location: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
  internationalPhoneNumber: z.string().optional(),
  websiteUri: z.string().optional(),
  regularOpeningHours: z.object({ periods: z.array(openingPeriodSchema).default([]) }).optional(),
  // `OPERATIONAL`, `CLOSED_TEMPORARILY` or `CLOSED_PERMANENTLY`; any other value means unknown to the admin.
  businessStatus: z.string().optional(),
})

export const placesSearchTextResponseSchema = z.object({
  places: z.array(placeSchema).default([]),
})

// The body of a failed request.
export const placesErrorResponseSchema = z.object({
  error: z.object({
    code: z.number().optional(),
    message: z.string(),
    status: z.string().optional(),
  }),
})

export type Place = z.infer<typeof placeSchema>
