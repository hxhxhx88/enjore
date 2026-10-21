import { z } from 'zod'

// The region a restaurant belongs to: an ISO 3166-1 alpha-2 code in lowercase, such as `hk` or `mo`. Open rather than
// an enum, because every restaurant an edition recognizes is imported whatever its region.
export const regionSchema = z.string().regex(/^[a-z]{2}$/)

export type Region = z.infer<typeof regionSchema>

// The region enriched and published first.
export const regionHongKong: Region = 'hk'
