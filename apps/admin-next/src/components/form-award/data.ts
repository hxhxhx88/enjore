import type { FormType } from './schema'
import { emptyToNull, nullToEmpty } from '@/lib/text'

// The award columns the form edits; assignable to Prisma's create and update inputs.
export interface AwardData {
  name: string
  nameLocale: string
  shortName: string | null
  slug: string
  website: string | null
  hasTier: boolean
  hasRank: boolean
  hasLabel: boolean
  scoreMax: number | null
  isActive: boolean
}

// The only place where `''` becomes `null` and the form's `hasScore` becomes a `scoreMax`.
export function toData(form: FormType): AwardData {
  return {
    name: form.name,
    nameLocale: form.nameLocale,
    shortName: emptyToNull(form.shortName),
    slug: form.slug,
    website: emptyToNull(form.website),
    hasTier: form.hasTier,
    hasRank: form.hasRank,
    hasLabel: form.hasLabel,
    scoreMax: form.hasScore ? form.scoreMax : null,
    isActive: form.isActive,
  }
}

export function toFormValues(award: AwardData): FormType {
  return {
    name: award.name,
    nameLocale: award.nameLocale,
    shortName: nullToEmpty(award.shortName),
    slug: award.slug,
    website: nullToEmpty(award.website),
    hasTier: award.hasTier,
    hasRank: award.hasRank,
    hasLabel: award.hasLabel,
    hasScore: award.scoreMax !== null,
    scoreMax: award.scoreMax,
    isActive: award.isActive,
  }
}
