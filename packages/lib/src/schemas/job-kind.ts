import { z } from 'zod'

// The kinds of work in the single queue (`jobs.kind`). Agent jobs need web research and judgment and run on a Claude
// runner; system tasks are deterministic code on a Trigger.dev worker. Both drain the same queue through the same
// tools. The order below is the enrichment chain: a canonical description first, then everything derived from it.
export const jobKinds = [
  'import-edition',
  'canonical-description',
  'structured-profile',
  'menu',
  'summary',
  'article',
  'poster-brief',
  'links',
  'resolve-identity',
  'render-poster',
  'refresh-places',
] as const
export const jobKindSchema = z.enum(jobKinds)
export type JobKind = (typeof jobKinds)[number]

export const jobClasses = ['agent', 'system'] as const
export const jobClassSchema = z.enum(jobClasses)
export type JobClass = (typeof jobClasses)[number]

export const jobKindClasses: Record<JobKind, JobClass> = {
  'import-edition': 'agent',
  'canonical-description': 'agent',
  'structured-profile': 'agent',
  'menu': 'agent',
  'summary': 'agent',
  'article': 'agent',
  'poster-brief': 'agent',
  'links': 'agent',
  'resolve-identity': 'system',
  'render-poster': 'system',
  'refresh-places': 'system',
}
