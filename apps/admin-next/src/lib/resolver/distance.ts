import type { Coordinates } from '@/lib/coordinates'

const earthRadiusMeters = 6_371_000

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

// The great-circle distance between two positions, by the haversine formula. Accurate to a few metres over the
// walking distances the resolver cares about.
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const latitudeDelta = toRadians(b.latitude - a.latitude)
  const longitudeDelta = toRadians(b.longitude - a.longitude)
  const h = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(longitudeDelta / 2) ** 2
  return 2 * earthRadiusMeters * Math.asin(Math.min(1, Math.sqrt(h)))
}
