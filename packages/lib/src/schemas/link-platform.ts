import { z } from 'zod'

// The platforms a restaurant links out to, one `restaurant_links` row each. Google Maps is derived from the place id
// in code, so its row only exists as an override. Adding a platform is a new value here and a resolver later, not a
// schema change.
export const linkPlatforms = ['google-maps', 'dianping', 'openrice', 'apple-maps', 'booking'] as const
export const linkPlatformSchema = z.enum(linkPlatforms)
export type LinkPlatform = (typeof linkPlatforms)[number]
