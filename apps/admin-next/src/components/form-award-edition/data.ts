import type { FormType } from './schema'
import { emptyToNull, nullToEmpty } from '@/lib/text'

// The edition columns the form edits; assignable to Prisma's create and update inputs.
export interface EditionData {
  label: string
  year: number
  region: string | null
  sourceUrl: string | null
  expectedCount: number | null
  notes: string | null
}

export function toData(form: FormType): EditionData {
  return {
    label: form.label,
    year: form.year,
    region: emptyToNull(form.region),
    sourceUrl: emptyToNull(form.sourceUrl),
    expectedCount: form.expectedCount,
    notes: emptyToNull(form.notes),
  }
}

export function toFormValues(edition: EditionData): FormType {
  return {
    label: edition.label,
    year: edition.year,
    region: nullToEmpty(edition.region),
    sourceUrl: nullToEmpty(edition.sourceUrl),
    expectedCount: edition.expectedCount,
    notes: nullToEmpty(edition.notes),
  }
}
