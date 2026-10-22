import type { BusinessStatus } from '@repo/lib/schemas/business-status'
import type { FactOrigin } from '@repo/lib/schemas/fact-origin'
import type { OpeningHours } from '@repo/lib/schemas/opening-hours'
import type { FactInput, FactKey } from '@/lib/facts'
import type { PlaceFacts } from '@/lib/places/map-facts'
import { Prisma } from '@repo/db'

// The fact columns as a write: a cleared JSON column is `Prisma.DbNull`, which Prisma requires in place of `null` for
// a `Json?` column in `create` and `update` data. Server-side only, because of the `Prisma` value import.
export interface FactColumnsWrite {
  address: string | null
  addressOrigin: FactOrigin
  district: string | null
  districtOrigin: FactOrigin
  latitude: number | null
  longitude: number | null
  coordinatesOrigin: FactOrigin
  phone: string | null
  phoneOrigin: FactOrigin
  website: string | null
  websiteOrigin: FactOrigin
  openingHours: OpeningHours | typeof Prisma.DbNull
  openingHoursOrigin: FactOrigin
  businessStatus: BusinessStatus | null
  businessStatusOrigin: FactOrigin
}

// The columns one fact writes, with the origin the write carries: `manual` for the operator, `google-places` for
// the resolver and the refresh.
export function factUpdate(input: FactInput, origin: FactOrigin): Partial<FactColumnsWrite> {
  switch (input.fact) {
    case 'address':
      return { address: input.value, addressOrigin: origin }
    case 'district':
      return { district: input.value, districtOrigin: origin }
    case 'coordinates':
      return { latitude: input.value?.latitude ?? null, longitude: input.value?.longitude ?? null, coordinatesOrigin: origin }
    case 'phone':
      return { phone: input.value, phoneOrigin: origin }
    case 'website':
      return { website: input.value, websiteOrigin: origin }
    case 'openingHours':
      return { openingHours: input.value ?? Prisma.DbNull, openingHoursOrigin: origin }
    case 'businessStatus':
      return { businessStatus: input.value, businessStatusOrigin: origin }
  }
}

// One fact of a place as a write input, so the refresh can compare and copy fact by fact.
export function placeFactInput(key: FactKey, place: PlaceFacts): FactInput {
  switch (key) {
    case 'address':
      return { fact: 'address', value: place.address }
    case 'district':
      return { fact: 'district', value: place.district }
    case 'coordinates':
      return { fact: 'coordinates', value: place.coordinates }
    case 'phone':
      return { fact: 'phone', value: place.phone }
    case 'website':
      return { fact: 'website', value: place.website }
    case 'openingHours':
      return { fact: 'openingHours', value: place.openingHours }
    case 'businessStatus':
      return { fact: 'businessStatus', value: place.businessStatus }
  }
}

// All seven facts of a new restaurant from its place, null values included so a refresh can fill them later.
export function factsFromPlace(place: PlaceFacts): FactColumnsWrite {
  const origin: FactOrigin = 'google-places'
  return {
    address: place.address,
    addressOrigin: origin,
    district: place.district,
    districtOrigin: origin,
    latitude: place.coordinates?.latitude ?? null,
    longitude: place.coordinates?.longitude ?? null,
    coordinatesOrigin: origin,
    phone: place.phone,
    phoneOrigin: origin,
    website: place.website,
    websiteOrigin: origin,
    openingHours: place.openingHours ?? Prisma.DbNull,
    openingHoursOrigin: origin,
    businessStatus: place.businessStatus,
    businessStatusOrigin: origin,
  }
}

// All seven facts of a restaurant created without a place: the typed address and nothing else, every origin manual
// so a later refresh, should a place id arrive, leaves them alone.
export function factsByHand(address: string | null): FactColumnsWrite {
  const origin: FactOrigin = 'manual'
  return {
    address,
    addressOrigin: origin,
    district: null,
    districtOrigin: origin,
    latitude: null,
    longitude: null,
    coordinatesOrigin: origin,
    phone: null,
    phoneOrigin: origin,
    website: null,
    websiteOrigin: origin,
    openingHours: Prisma.DbNull,
    openingHoursOrigin: origin,
    businessStatus: null,
    businessStatusOrigin: origin,
  }
}
