import { z } from 'zod'

// Where a restaurant's Places fact came from: address, district, coordinates, phone, website, opening hours and
// business status each record one. Only `places` facts are refreshed; a fact an agent or the operator set is left
// alone, and a null value with a `manual` origin is a fact the operator cleared.
export const factOrigins = ['places', 'agent', 'manual'] as const
export const factOriginSchema = z.enum(factOrigins)
export type FactOrigin = (typeof factOrigins)[number]
