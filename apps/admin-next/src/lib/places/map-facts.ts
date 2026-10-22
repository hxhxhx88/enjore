import type { BusinessStatus } from '@repo/lib/schemas/business-status'
import type { Place } from '@repo/lib/schemas/google-places'
import type { OpeningHours, OpeningHoursPeriod } from '@repo/lib/schemas/opening-hours'
import type { Coordinates } from '@/lib/coordinates'
import { regionSchema } from '@repo/lib/schemas/region'

// The facts a place gives a restaurant, in the shapes the columns hold. Every fact is nullable: a place Google knows
// little about still resolves, and a later refresh may fill what was missing.
export interface PlaceFacts {
  placeId: string
  displayName: string | null
  region: string | null
  address: string | null
  district: string | null
  coordinates: Coordinates | null
  phone: string | null
  website: string | null
  openingHours: OpeningHours | null
  businessStatus: BusinessStatus | null
}

const businessStatuses: Readonly<Record<string, BusinessStatus>> = {
  OPERATIONAL: 'open',
  CLOSED_TEMPORARILY: 'temporarily-closed',
  CLOSED_PERMANENTLY: 'permanently-closed',
}

type AddressComponent = NonNullable<Place['addressComponents']>[number]
type OpeningPoint = NonNullable<Place['regularOpeningHours']>['periods'][number]['open']

function componentOfType(components: readonly AddressComponent[], type: string): AddressComponent | undefined {
  return components.find(component => component.types.includes(type))
}

// The district is the neighborhood when Google names one (Hong Kong's "Central", "Tsim Sha Tsui"), else the coarsest
// sublocality (Macau's "Cotai", Tokyo's "Ginza" rather than its block number). Components come most specific first
// and every sublocality level also carries the plain `sublocality` type, so the coarsest is the last one.
function mapDistrict(components: readonly AddressComponent[]): string | null {
  const component = componentOfType(components, 'neighborhood') ?? componentOfType([...components].reverse(), 'sublocality')
  return component?.longText ?? null
}

// The region is the country component's ISO code, which is what the schema stores; anything else leaves it unset so
// the operator's choice stands.
function mapRegion(components: readonly AddressComponent[]): string | null {
  const code = componentOfType(components, 'country')?.shortText?.toLowerCase()
  const parsed = regionSchema.safeParse(code)
  return parsed.success ? parsed.data : null
}

function formatTime(point: OpeningPoint): string {
  return `${String(point.hour).padStart(2, '0')}:${String(point.minute).padStart(2, '0')}`
}

const weekdays = [0, 1, 2, 3, 4, 5, 6] as const

// A period with no close is Google's "always open"; it becomes seven full days so the schema's shape holds and the
// text format can show it.
function mapPeriods(periods: NonNullable<Place['regularOpeningHours']>['periods']): OpeningHoursPeriod[] {
  if (periods.some(period => period.close === undefined)) {
    return weekdays.map(day => ({ openDay: day, openTime: '00:00', closeDay: (day + 1) % 7, closeTime: '00:00' }))
  }
  return periods.flatMap(({ open, close }) => close === undefined
    ? []
    : [{ openDay: open.day, openTime: formatTime(open), closeDay: close.day, closeTime: formatTime(close) }])
}

export function mapPlaceFacts(place: Place): PlaceFacts {
  const components = place.addressComponents ?? []
  const periods = mapPeriods(place.regularOpeningHours?.periods ?? [])

  return {
    placeId: place.id,
    displayName: place.displayName?.text ?? null,
    region: mapRegion(components),
    address: place.formattedAddress ?? null,
    district: mapDistrict(components),
    coordinates: place.location ?? null,
    phone: place.internationalPhoneNumber ?? null,
    website: place.websiteUri ?? null,
    openingHours: periods.length === 0 ? null : { periods },
    businessStatus: place.businessStatus === undefined ? null : businessStatuses[place.businessStatus] ?? null,
  }
}
