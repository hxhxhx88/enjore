import type { PlacesClient } from './client'
import { env } from '@/lib/env'
import { newPlacesClient } from './client'

// The only file of this folder that reads the environment, so everything else stays testable.
export function connectPlaces(): PlacesClient {
  return newPlacesClient(env.GOOGLE_PLACES_API_KEY)
}
