import type { Place } from '@repo/lib/schemas/google-places'
import type { Coordinates } from '@/lib/coordinates'
import { placeSchema, placesErrorResponseSchema, placesSearchTextResponseSchema } from '@repo/lib/schemas/google-places'

// A thin client for Places API (New): the text search that resolves an entry and the details that fill the facts.
// The key is passed in and `fetch` can be replaced, so the resolver is testable without the environment; the
// server reads the key in `connect.ts`.

// A soft preference for results near an area, in the API's own shape. The circle's radius is in metres, at most
// 50 000; a rectangle has no limit.
export type LocationBias
  = | { circle: { center: Coordinates, radius: number } }
    | { rectangle: { low: Coordinates, high: Coordinates } }

interface SearchTextInput {
  textQuery: string
  languageCode: string
  regionCode?: string | undefined
  locationBias?: LocationBias | undefined
}

interface PlaceDetailsInput {
  languageCode: string
}

export interface PlacesClient {
  searchText: (input: SearchTextInput) => Promise<Place[]>
  getPlace: (placeId: string, input: PlaceDetailsInput) => Promise<Place>
}

// A response the API refused, with its HTTP status and the message from its error body.
export class PlacesError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'PlacesError'
    this.status = status
  }
}

const baseUrl = 'https://places.googleapis.com/v1'

// The search asks for what the resolver scores; the details ask for the seven facts. `displayName` and
// `businessStatus` are Pro fields, the phone, website and hours Enterprise fields, so the search stays cheap.
const searchFieldMask = 'places.id,places.displayName,places.formattedAddress,places.location'
const detailsFieldMask = [
  'id',
  'displayName',
  'formattedAddress',
  'addressComponents',
  'location',
  'internationalPhoneNumber',
  'websiteUri',
  'regularOpeningHours',
  'businessStatus',
].join(',')

// The resolver trusts the top result or shows a handful to the operator; more would only cost.
const searchPageSize = 5

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  try {
    const parsed: unknown = JSON.parse(text)
    return parsed
  }
  catch {
    return undefined
  }
}

export function newPlacesClient(apiKey: string, fetchImpl: typeof fetch = fetch): PlacesClient {
  async function request(url: string, init: RequestInit, fieldMask: string): Promise<unknown> {
    const response = await fetchImpl(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
    })
    const body = await readJson(response)
    if (!response.ok) {
      const parsed = placesErrorResponseSchema.safeParse(body)
      throw new PlacesError(response.status, parsed.success ? parsed.data.error.message : `Google Places answered ${response.status}.`)
    }
    return body
  }

  return {
    async searchText({ textQuery, languageCode, regionCode, locationBias }) {
      const body = await request(`${baseUrl}/places:searchText`, {
        method: 'POST',
        body: JSON.stringify({
          textQuery,
          languageCode,
          pageSize: searchPageSize,
          ...(regionCode === undefined ? {} : { regionCode }),
          ...(locationBias === undefined ? {} : { locationBias }),
        }),
      }, searchFieldMask)
      return placesSearchTextResponseSchema.parse(body).places
    },

    async getPlace(placeId, { languageCode }) {
      const url = `${baseUrl}/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(languageCode)}`
      const body = await request(url, { method: 'GET' }, detailsFieldMask)
      return placeSchema.parse(body)
    },
  }
}
