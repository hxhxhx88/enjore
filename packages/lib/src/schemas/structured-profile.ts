import { z } from 'zod'

// The structured profile: the factors people weigh when choosing a restaurant, stored as JSON in
// `restaurant_profiles.structured_profile` and its draft. Values are keys from the vocabularies below, so they are
// locale-independent and the apps translate the labels. A null factor means unknown; an empty list means none known.
// Factors start universal and easily sourced; more are added one at a time once public information answers them
// reliably.

export const cuisines = [
  'cantonese',
  'sichuan',
  'shanghainese',
  'chiuchow',
  'hakka',
  'hunan',
  'beijing',
  'taiwanese',
  'chinese',
  'dim-sum',
  'hotpot',
  'noodles',
  'japanese',
  'sushi',
  'korean',
  'thai',
  'vietnamese',
  'malaysian',
  'singaporean',
  'indonesian',
  'filipino',
  'indian',
  'middle-eastern',
  'french',
  'italian',
  'spanish',
  'portuguese',
  'british',
  'american',
  'mexican',
  'mediterranean',
  'european',
  'steakhouse',
  'seafood',
  'vegetarian',
  'innovative',
  'other',
] as const
export const cuisineSchema = z.enum(cuisines)
export type Cuisine = (typeof cuisines)[number]

// Per person for a typical meal: under 200, 200 to 500, 500 to 1500, and over 1500 Hong Kong dollars.
export const priceBands = ['budget', 'moderate', 'premium', 'luxury'] as const
export const priceBandSchema = z.enum(priceBands)
export type PriceBand = (typeof priceBands)[number]

export const occasions = ['date', 'solo', 'business', 'family', 'friends', 'celebration', 'group'] as const
export const occasionSchema = z.enum(occasions)
export type Occasion = (typeof occasions)[number]

export const mealPeriods = ['breakfast', 'brunch', 'lunch', 'afternoon-tea', 'dinner', 'late-night'] as const
export const mealPeriodSchema = z.enum(mealPeriods)
export type MealPeriod = (typeof mealPeriods)[number]

export const formalities = ['casual', 'smart-casual', 'fine-dining'] as const
export const formalitySchema = z.enum(formalities)
export type Formality = (typeof formalities)[number]

export const reservationPolicies = ['walk-in', 'recommended', 'required'] as const
export const reservationPolicySchema = z.enum(reservationPolicies)
export type ReservationPolicy = (typeof reservationPolicies)[number]

export const menuFormats = ['a-la-carte', 'tasting-menu', 'both'] as const
export const menuFormatSchema = z.enum(menuFormats)
export type MenuFormat = (typeof menuFormats)[number]

export const structuredProfileSchema = z.object({
  cuisines: z.array(cuisineSchema).default([]),
  priceBand: priceBandSchema.nullable().default(null),
  occasions: z.array(occasionSchema).default([]),
  mealPeriods: z.array(mealPeriodSchema).default([]),
  formality: formalitySchema.nullable().default(null),
  reservationPolicy: reservationPolicySchema.nullable().default(null),
  menuFormat: menuFormatSchema.nullable().default(null),
  // Dish names in the restaurant's own language; notes about them belong in the article.
  signatureDishes: z.array(z.string().trim().min(1)).default([]),
})

export type StructuredProfile = z.infer<typeof structuredProfileSchema>
