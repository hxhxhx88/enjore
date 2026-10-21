import { z } from 'zod'
import { localeTagSchema } from './locale-tag'
import { regionSchema } from './region'

// One entry of an edition import as the agent or a pasted list submits it, stored in `import_entries.payload`. The
// names are the official ones the source shows: `name` is the one proposed as canonical from the nature of the
// restaurant, the others become Translation rows. `referenceUrl` is where the accolade was published and is
// mandatory; `listingUrl` is the venue's own page on the guide site when it has one, the identity key across
// editions. Facets are the award's: tier names as the award defines them (several tiers make several accolades), a
// rank, a score, a named prize.
const text = z.string().trim().min(1)

export const importEntryNameSchema = z.object({
  value: text,
  locale: localeTagSchema,
})

export const importEntryPayloadSchema = z.object({
  name: importEntryNameSchema,
  otherNames: z.array(importEntryNameSchema).default([]),
  address: text,
  region: regionSchema.optional(),
  googleMapsUrl: z.url().optional(),
  listingUrl: z.url().optional(),
  facets: z.object({
    tiers: z.array(text).default([]),
    rank: z.number().int().positive().optional(),
    score: z.number().nonnegative().optional(),
    label: text.optional(),
  }),
  referenceUrl: z.url(),
  note: text.optional(),
})

export type ImportEntryName = z.infer<typeof importEntryNameSchema>
export type ImportEntryPayload = z.infer<typeof importEntryPayloadSchema>

// The candidates the resolver found for an entry, stored in `import_entries.candidates` best first. A candidate whose
// restaurant has since been deleted is skipped when rendering.
export const importCandidateSchema = z.object({
  restaurantId: z.string().min(1),
  distanceMeters: z.number().nonnegative().optional(),
  nameSimilarity: z.number().min(0).max(1),
  addressSimilarity: z.number().min(0).max(1).optional(),
})
export const importCandidatesSchema = z.array(importCandidateSchema)

export type ImportCandidate = z.infer<typeof importCandidateSchema>
