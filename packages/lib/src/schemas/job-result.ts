import type { JobKind } from './job-kind'
import { z } from 'zod'

// What a finished job of each kind writes in `jobs.result`, keyed by the `kind` column: parse with
// `jobResultSchemas[kind]`. Only the kinds that have landed are listed; the others arrive with their milestones.
export const jobResultSchemas = {
  // The facts the refresh changed, named by their keys in `apps/admin-next/src/lib/facts.ts`; empty when nothing moved.
  'refresh-google-places': z.object({ changedFields: z.array(z.string()) }),
} satisfies Partial<Record<JobKind, z.ZodType>>

export type JobResult<K extends keyof typeof jobResultSchemas> = z.infer<(typeof jobResultSchemas)[K]>
