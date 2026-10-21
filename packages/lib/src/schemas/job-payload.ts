import type { JobKind } from './job-kind'
import { z } from 'zod'
import { localeTagSchema } from './locale-tag'

// What a job of each kind carries in `jobs.payload`, keyed by the `kind` column: parse with
// `jobPayloadSchemas[kind]`. Notes are the operator's steering for a regeneration, such as "shorter" or "mention the
// set lunch"; a job without them carries none.
const notes = z.string().trim().min(1).optional()

export const jobPayloadSchemas = {
  'import-edition': z.object({}),
  'canonical-description': z.object({ notes }),
  // `replaceAll` false fills empty fields and leaves locked ones alone; true is the confirmed "replace everything".
  'structured-profile': z.object({ notes, replaceAll: z.boolean().default(false) }),
  'menu': z.object({ notes }),
  // A null locale means the restaurant's native locale, the profile's text columns; any other locale is written
  // natively into Translation rows.
  'summary': z.object({ notes, locale: localeTagSchema.nullable().default(null) }),
  'article': z.object({ notes, locale: localeTagSchema.nullable().default(null) }),
  'poster-brief': z.object({ notes, renderAfterBrief: z.boolean().default(true) }),
  'links': z.object({}),
  'resolve-identity': z.object({}),
  'render-poster': z.object({ notes, variantCount: z.number().int().min(1).max(8).optional() }),
  'refresh-places': z.object({}),
} satisfies Record<JobKind, z.ZodType>

export type JobPayload<K extends JobKind = JobKind> = z.infer<(typeof jobPayloadSchemas)[K]>
