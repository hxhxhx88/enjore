import { z } from 'zod'

// Which tables and fields the Translation table may overlay. A row says: `field` of the record `recordId` in `table`
// reads as `value` in `locale`. Tables are named by their Prisma `@@map` names and fields by their Prisma field
// names, so a key survives model renames. Every user-facing field stored once in its native language is listed; a
// profile's summary and article are included because their other locales live in rows too, written natively by
// content jobs rather than translated.
export const translatableTables = [
  'restaurants',
  'chains',
  'awards',
  'award_tiers',
  'award_editions',
  'accolades',
  'restaurant_profiles',
  'restaurant_profile_drafts',
] as const
export const translatableTableSchema = z.enum(translatableTables)
export type TranslatableTable = (typeof translatableTables)[number]

export const translatableFields = {
  restaurants: ['name', 'address', 'district'],
  chains: ['name'],
  awards: ['name', 'shortName'],
  award_tiers: ['name'],
  award_editions: ['label'],
  accolades: ['label'],
  restaurant_profiles: ['summary', 'article'],
  restaurant_profile_drafts: ['summary', 'article'],
} as const satisfies Record<TranslatableTable, readonly string[]>

export type TranslatableField<T extends TranslatableTable = TranslatableTable> = (typeof translatableFields)[T][number]
