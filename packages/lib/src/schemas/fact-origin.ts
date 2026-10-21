import { z } from 'zod'

// Where a restaurant's Google Places fact came from: address, district, coordinates, phone, website, opening hours
// and business status each record one. Only `google-places` facts are refreshed; a fact an agent or the operator set
// is left alone. A null value with a `google-places` origin is one Places had nothing for, while a null value with a
// `manual` origin is a fact the operator cleared.
export const factOrigins = ['google-places', 'agent', 'manual'] as const
export const factOriginSchema = z.enum(factOrigins)
export type FactOrigin = (typeof factOrigins)[number]
