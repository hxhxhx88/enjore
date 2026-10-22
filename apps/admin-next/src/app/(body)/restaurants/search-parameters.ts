import { businessStatuses, businessStatusSchema } from '@repo/lib/schemas/business-status'
import { regionSchema } from '@repo/lib/schemas/region'
import { z } from 'zod'
import { publicationStates, publicationStateSchema } from '@/lib/derive-publication-state'
import { businessStatusLabels, publicationStateLabels } from '@/lib/labels'
import { staleAfterDays } from '@/lib/stale-basics'

export const stateFilterOptions = publicationStates.map(state => ({ value: state, label: publicationStateLabels[state] }))

export const statusFilterOptions = businessStatuses.map(status => ({ value: status, label: businessStatusLabels[status] }))

export const staleFilterOptions = [{ value: 'true', label: `Stale basics (${staleAfterDays} days)` }] as const

// Query parameters are external input: anything unparsable falls back to its default instead of failing the page.
export const searchParametersSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  q: z.string().trim().max(100).catch(''),
  region: regionSchema.optional().catch(undefined),
  chain: z.string().min(1).optional().catch(undefined),
  state: publicationStateSchema.optional().catch(undefined),
  status: businessStatusSchema.optional().catch(undefined),
  stale: z.literal('true').optional().catch(undefined),
})

export const pageSize = 50
