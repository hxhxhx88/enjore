import { z } from 'zod'

// Whether a venue is trading, as Google Places reports it and the operator may override it. A published restaurant
// whose status turns closed surfaces in the inbox.
export const businessStatuses = ['open', 'temporarily-closed', 'permanently-closed'] as const
export const businessStatusSchema = z.enum(businessStatuses)
export type BusinessStatus = (typeof businessStatuses)[number]
