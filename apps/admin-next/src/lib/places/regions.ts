import type { LocationBias } from './client'
import type { Coordinates } from '@/lib/coordinates'

interface Rectangle {
  low: Coordinates
  high: Coordinates
}

// Bounding boxes that bias the text search towards the region the operator chose. A region without one gets the
// `regionCode` alone, which still formats and slightly biases the results.
const regionBounds: Readonly<Record<string, Rectangle>> = {
  hk: { low: { latitude: 22.15, longitude: 113.83 }, high: { latitude: 22.57, longitude: 114.41 } },
  mo: { low: { latitude: 22.10, longitude: 113.52 }, high: { latitude: 22.22, longitude: 113.60 } },
  cn: { low: { latitude: 18.0, longitude: 73.5 }, high: { latitude: 53.6, longitude: 135.1 } },
  tw: { low: { latitude: 21.9, longitude: 119.3 }, high: { latitude: 25.4, longitude: 122.0 } },
  jp: { low: { latitude: 24.0, longitude: 122.9 }, high: { latitude: 45.6, longitude: 146.0 } },
  sg: { low: { latitude: 1.20, longitude: 103.6 }, high: { latitude: 1.48, longitude: 104.1 } },
  kr: { low: { latitude: 33.0, longitude: 124.6 }, high: { latitude: 38.7, longitude: 131.9 } },
  th: { low: { latitude: 5.6, longitude: 97.3 }, high: { latitude: 20.5, longitude: 105.7 } },
  my: { low: { latitude: 0.8, longitude: 99.6 }, high: { latitude: 7.4, longitude: 119.3 } },
}

export function regionBias(region: string): LocationBias | undefined {
  const rectangle = regionBounds[region]
  return rectangle === undefined ? undefined : { rectangle }
}

// The CLDR region code the API takes, from the lowercase code the schema stores.
export function regionCodeOf(region: string): string {
  return region.toUpperCase()
}
