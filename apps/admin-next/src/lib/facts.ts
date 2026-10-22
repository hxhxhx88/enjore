import type { BusinessStatus } from '@repo/lib/schemas/business-status'
import type { FactOrigin } from '@repo/lib/schemas/fact-origin'
import type { OpeningHours } from '@repo/lib/schemas/opening-hours'
import type { Coordinates } from '@/lib/coordinates'
import { businessStatusSchema } from '@repo/lib/schemas/business-status'
import { factOriginSchema } from '@repo/lib/schemas/fact-origin'
import { openingHoursSchema } from '@repo/lib/schemas/opening-hours'
import { z } from 'zod'
import { coordinatesSchema } from '@/lib/coordinates'

// The seven Google Places facts of a restaurant, each with its own origin column. Coordinates are one fact over two
// columns. This file is pure so the forms can share it; the writes live in `fact-update.ts`.
export const factKeys = ['address', 'district', 'coordinates', 'phone', 'website', 'openingHours', 'businessStatus'] as const
export const factKeySchema = z.enum(factKeys)
export type FactKey = (typeof factKeys)[number]

const text = z.string().trim().min(1)

// A fact with a value, as an edit sends it.
export const factValueSchema = z.discriminatedUnion('fact', [
  z.object({ fact: z.literal('address'), value: text }),
  z.object({ fact: z.literal('district'), value: text }),
  z.object({ fact: z.literal('coordinates'), value: coordinatesSchema }),
  z.object({ fact: z.literal('phone'), value: text }),
  z.object({ fact: z.literal('website'), value: z.url() }),
  z.object({ fact: z.literal('openingHours'), value: openingHoursSchema }),
  z.object({ fact: z.literal('businessStatus'), value: businessStatusSchema }),
])
export type FactValue = z.infer<typeof factValueSchema>

type FactValueOf<K extends FactKey> = Extract<FactValue, { fact: K }>['value']

// A fact with a value or cleared; the shape a write takes.
export type FactInput = { [K in FactKey]: { fact: K, value: FactValueOf<K> | null } }[FactKey]

// The columns as the pages load them; `openingHours` is the raw JSON column.
export interface FactColumns {
  address: string | null
  addressOrigin: string
  district: string | null
  districtOrigin: string
  latitude: number | null
  longitude: number | null
  coordinatesOrigin: string
  phone: string | null
  phoneOrigin: string
  website: string | null
  websiteOrigin: string
  openingHours: unknown
  openingHoursOrigin: string
  businessStatus: string | null
  businessStatusOrigin: string
}

interface Fact<Value> {
  value: Value | null
  origin: FactOrigin
}

export interface Facts {
  address: Fact<string>
  district: Fact<string>
  coordinates: Fact<Coordinates>
  phone: Fact<string>
  website: Fact<string>
  openingHours: Fact<OpeningHours>
  businessStatus: Fact<BusinessStatus>
}

// The columns parsed into typed facts; the vocabularies and the JSON are external to the code and parsed on read.
export function readFacts(row: FactColumns): Facts {
  return {
    address: { value: row.address, origin: factOriginSchema.parse(row.addressOrigin) },
    district: { value: row.district, origin: factOriginSchema.parse(row.districtOrigin) },
    coordinates: {
      value: row.latitude !== null && row.longitude !== null ? { latitude: row.latitude, longitude: row.longitude } : null,
      origin: factOriginSchema.parse(row.coordinatesOrigin),
    },
    phone: { value: row.phone, origin: factOriginSchema.parse(row.phoneOrigin) },
    website: { value: row.website, origin: factOriginSchema.parse(row.websiteOrigin) },
    openingHours: {
      value: row.openingHours === null || row.openingHours === undefined ? null : openingHoursSchema.parse(row.openingHours),
      origin: factOriginSchema.parse(row.openingHoursOrigin),
    },
    businessStatus: {
      value: row.businessStatus === null ? null : businessStatusSchema.parse(row.businessStatus),
      origin: factOriginSchema.parse(row.businessStatusOrigin),
    },
  }
}

// One fact of parsed facts as a write input, for comparing and copying.
export function factInputOf(facts: Facts, key: FactKey): FactInput {
  switch (key) {
    case 'address':
      return { fact: 'address', value: facts.address.value }
    case 'district':
      return { fact: 'district', value: facts.district.value }
    case 'coordinates':
      return { fact: 'coordinates', value: facts.coordinates.value }
    case 'phone':
      return { fact: 'phone', value: facts.phone.value }
    case 'website':
      return { fact: 'website', value: facts.website.value }
    case 'openingHours':
      return { fact: 'openingHours', value: facts.openingHours.value }
    case 'businessStatus':
      return { fact: 'businessStatus', value: facts.businessStatus.value }
  }
}

export function formatCoordinates({ latitude, longitude }: Coordinates): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}
