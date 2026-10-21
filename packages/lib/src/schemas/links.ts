import { z } from 'zod'

// The outbound links of a profile, stored as JSON in `restaurant_profiles.links` and its draft, keyed by platform.
// Each value is the platform's own reference, from which the apps build the web URL or the app link in code: a
// Dianping shop id, an OpenRice restaurant id, an Apple Maps place id, and the booking page as its URL since it has
// no id. Google Maps is not stored because it follows from the restaurant's Google place id. Adding a platform is a
// new key here and a link builder in the apps, not a schema change.
export const linkPlatforms = ['dianping', 'openrice', 'appleMaps', 'booking'] as const
export const linkPlatformSchema = z.enum(linkPlatforms)
export type LinkPlatform = (typeof linkPlatforms)[number]

const reference = z.string().trim().min(1)

const linksShape = {
  dianping: reference.optional(),
  openrice: reference.optional(),
  appleMaps: reference.optional(),
  booking: z.url().optional(),
} satisfies Record<LinkPlatform, z.ZodType>

export const linksSchema = z.object(linksShape)

export type Links = z.infer<typeof linksSchema>
