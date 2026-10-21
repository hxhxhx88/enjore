import { z } from 'zod'

const activeFilters = ['true', 'false'] as const

export const activeFilterOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const

// Query parameters are external input: anything unparsable falls back to its default instead of failing the page.
export const searchParametersSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  active: z.enum(activeFilters).optional().catch(undefined),
  q: z.string().trim().max(100).catch(''),
})

export const pageSize = 50
