import { z } from 'zod'

// A digitized menu, stored as JSON in `restaurant_profiles.menu` and its draft, informed by schema.org/Menu. Text is
// kept in the language the restaurant uses. The source URL and capture date are shown by the apps because menus go
// stale. Prices are numbers in `currency`; `priceNote` holds what a number cannot, such as "market price" or "per
// person".

export const dietaryTags = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'halal',
  'kosher',
  'contains-nuts',
  'contains-shellfish',
  'spicy',
  'raw',
] as const
export const dietaryTagSchema = z.enum(dietaryTags)
export type DietaryTag = (typeof dietaryTags)[number]

const text = z.string().trim().min(1)

export const menuItemSchema = z.object({
  name: text,
  description: text.optional(),
  price: z.number().nonnegative().optional(),
  priceNote: text.optional(),
  dietaryTags: z.array(dietaryTagSchema).default([]),
})

export const menuSectionSchema = z.object({
  name: text,
  description: text.optional(),
  items: z.array(menuItemSchema),
})

export const menuDocumentSchema = z.object({
  name: text,
  description: text.optional(),
  sections: z.array(menuSectionSchema),
})

export const menuSchema = z.object({
  sourceUrl: z.url(),
  capturedAt: z.iso.date(),
  currency: z.string().regex(/^[A-Z]{3}$/), // ISO 4217, such as HKD
  menus: z.array(menuDocumentSchema),
})

export type MenuItem = z.infer<typeof menuItemSchema>
export type MenuSection = z.infer<typeof menuSectionSchema>
export type MenuDocument = z.infer<typeof menuDocumentSchema>
export type Menu = z.infer<typeof menuSchema>
