import type { Coordinates } from '@/lib/coordinates'
import { coordinatesSchema } from '@/lib/coordinates'

// What a Google Maps link says about a place: the name from the `/maps/place/<name>` segment or a `q` parameter, the
// position from the pin (`!3d<lat>!4d<lng>`), the viewport (`@lat,lng,zoom`) or a `q=lat,lng`, and a place id when
// the link carries one (`query_place_id=` or `q=place_id:`).
export interface MapsUrlInfo {
  name: string | null
  coordinates: Coordinates | null
  placeId: string | null
}

const mapsHostPattern = /(?:^|\.)google\.[a-z.]+$/
const pinPattern = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/
const latLngPattern = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
const placeIdPrefix = 'place_id:'

function parseLatLng(text: string): Coordinates | null {
  const match = latLngPattern.exec(text)
  if (match === null) {
    return null
  }
  const parsed = coordinatesSchema.safeParse({ latitude: Number(match[1]), longitude: Number(match[2]) })
  return parsed.success ? parsed.data : null
}

// Maps writes spaces as `+` in the path and may double-encode the rest.
function decodeSegment(segment: string): string {
  const spaced = segment.replace(/\+/g, ' ')
  try {
    return decodeURIComponent(spaced).trim()
  }
  catch {
    return spaced.trim()
  }
}

export function parseMapsUrl(url: string): MapsUrlInfo | undefined {
  let parsed: URL
  try {
    parsed = new URL(url)
  }
  catch {
    return undefined
  }
  if (!mapsHostPattern.test(parsed.hostname)) {
    return undefined
  }

  let name: string | null = null
  let coordinates: Coordinates | null = null
  let placeId: string | null = parsed.searchParams.get('query_place_id')

  // `?q=` and `?query=` carry a text, a `lat,lng` pair or a `place_id:` reference.
  const query = parsed.searchParams.get('q') ?? parsed.searchParams.get('query')
  if (query !== null && query.trim() !== '') {
    if (query.startsWith(placeIdPrefix)) {
      placeId = query.slice(placeIdPrefix.length)
    }
    else {
      const latLng = parseLatLng(query)
      if (latLng === null) {
        name = query.trim()
      }
      else {
        coordinates = latLng
      }
    }
  }

  // `/maps/place/<name>/@lat,lng,zoom/data=...` and `/maps/search/<text>/@...`.
  const segments = parsed.pathname.split('/').filter(segment => segment !== '')
  for (const marker of ['place', 'search']) {
    const index = segments.indexOf(marker)
    const segment = index === -1 ? undefined : segments[index + 1]
    if (segment !== undefined && !segment.startsWith('@') && !segment.startsWith('data=')) {
      const text = decodeSegment(segment)
      const latLng = parseLatLng(text)
      if (latLng === null) {
        name = text
      }
      else {
        coordinates = latLng
      }
    }
  }

  const viewport = segments.find(segment => segment.startsWith('@'))
  if (viewport !== undefined) {
    coordinates = parseLatLng(viewport.slice(1)) ?? coordinates
  }

  // The pin is the place itself; the viewport is only where the map was looking.
  const pin = pinPattern.exec(url)
  if (pin !== null) {
    coordinates = parseLatLng(`${pin[1]},${pin[2]}`) ?? coordinates
  }

  if (name === null && coordinates === null && placeId === null) {
    return undefined
  }
  return { name, coordinates, placeId }
}

// Links copied from the Maps apps are short redirects to the full URL.
export function isShortMapsUrl(url: string): boolean {
  try {
    const { hostname, pathname } = new URL(url)
    return hostname === 'maps.app.goo.gl' || (hostname === 'goo.gl' && pathname.startsWith('/maps/')) || hostname === 'g.co'
  }
  catch {
    return false
  }
}

const maxRedirects = 5

// Follows a short link's redirects on the server and returns the final URL. Bodies are never read; only the
// `Location` headers matter.
export async function expandMapsUrl(url: string, fetchImpl: typeof fetch = fetch): Promise<string> {
  let current = url
  for (let hop = 0; hop < maxRedirects; hop++) {
    const response = await fetchImpl(current, { method: 'GET', redirect: 'manual' })
    await response.body?.cancel()
    const location = response.headers.get('location')
    if (response.status < 300 || response.status >= 400 || location === null) {
      return current
    }
    current = new URL(location, current).toString()
  }
  return current
}

// The documented Maps URL form that opens a place by its id, with the name as the fallback search.
export function googleMapsLink(placeId: string, name: string): string {
  const parameters = new URLSearchParams({ api: '1', query: name, query_place_id: placeId })
  return `https://www.google.com/maps/search/?${parameters.toString()}`
}
