import { z } from 'zod'

// How a Prisma 7 driver adapter reports a constraint violation. `fields` are database column names parsed from the
// Postgres detail text, quoted when the name is a reserved word (`"table"`). `index` is the constraint name, which is
// how a referential violation on delete arrives, because Postgres names no column for it.
const schemaConstraint = z.union([
  z.object({ fields: z.array(z.string()) }),
  z.object({ index: z.string() }),
])

const schemaCause = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('UniqueConstraintViolation'), constraint: schemaConstraint.optional() }),
  z.object({ kind: z.literal('ForeignKeyConstraintViolation'), constraint: schemaConstraint.optional() }),
])

const schemaError = z.object({
  meta: z.object({
    // Absent for raw queries. A nested write names the outer model, so unique keys match on their columns first.
    modelName: z.string().optional(),
    driverAdapterError: z.object({ cause: schemaCause }),
  }),
})

interface DatabaseErrorUnique {
  kind: 'unique'
  // The database columns of the violated key, so a caller can tell one key from another; empty when unknown.
  columns: readonly string[]
  message: string
}

interface DatabaseErrorForeignKey {
  kind: 'foreign-key'
  message: string
}

export type DatabaseError = DatabaseErrorUnique | DatabaseErrorForeignKey

interface UniqueKey {
  columns: readonly string[]
  // Only when the same column list exists on several tables.
  model?: string
  message: string
}

// Every unique key of `packages/db/prisma/schema.prisma` that user input can violate.
const uniqueKeys: readonly UniqueKey[] = [
  { columns: ['slug'], message: 'Slug already in use.' },
  { columns: ['google_place_ref'], message: 'A restaurant with this Google place already exists.' },
  { columns: ['award_id', 'name'], message: 'A tier with this name already exists in this award.' },
  { columns: ['award_id', 'label'], message: 'An edition with this label already exists in this award.' },
  { columns: ['award_id', 'listing_url'], message: 'This listing URL already belongs to a restaurant.' },
  { columns: ['restaurant_id', 'edition_id', 'tier_id'], message: 'This restaurant already holds this tier in this edition.' },
  { columns: ['locale', 'table', 'record_id', 'field'], message: 'A translation for this field already exists in this locale.' },
  { columns: ['url'], message: 'This artwork URL is already registered.' },
  { columns: ['restaurant_id'], model: 'RestaurantProfile', message: 'This restaurant already has a published profile.' },
  { columns: ['restaurant_id'], model: 'RestaurantProfileDraft', message: 'This restaurant already has a draft.' },
]

// The foreign keys declared `Restrict` in the schema, the only ones a delete can violate.
const restrictedForeignKeys: Readonly<Record<string, string>> = {
  accolades_award_id_edition_id_fkey: 'This edition has accolades and cannot be deleted.',
  accolades_award_id_tier_id_fkey: 'This tier has accolades and cannot be deleted.',
  source_references_award_id_fkey: 'Restaurants still reference this award; deactivate it instead of deleting it.',
  restaurant_profiles_restaurant_id_poster_artwork_id_fkey: 'This artwork is the poster of a published profile.',
  restaurant_profile_drafts_restaurant_id_poster_artwork_id_fkey: 'This artwork is the poster of a draft.',
}

function normalizeColumn(column: string): string {
  return column.replace(/^"|"$/g, '')
}

function sameColumns(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((column, i) => column === b[i])
}

// Whether the error is a unique violation on exactly these database columns.
export function violatesUniqueKey(error: DatabaseError, columns: readonly string[]): boolean {
  return error.kind === 'unique' && sameColumns(error.columns, columns)
}

// Turns a database error into a message the operator can act on, or `undefined` for anything that is not a constraint
// violation, which the caller rethrows. See `docs/development/0003-coding/runtime-error-handling.md`.
export function parseDatabaseError(e: unknown): DatabaseError | undefined {
  const parsed = schemaError.safeParse(e)
  if (!parsed.success) {
    return undefined
  }

  const { modelName, driverAdapterError: { cause } } = parsed.data.meta
  const model = modelName ?? 'Record'

  switch (cause.kind) {
    case 'UniqueConstraintViolation': {
      const columns = cause.constraint !== undefined && 'fields' in cause.constraint
        ? cause.constraint.fields.map(normalizeColumn)
        : []
      const key = uniqueKeys.find(k => sameColumns(k.columns, columns) && (k.model === undefined || k.model === modelName))
      if (key) {
        return { kind: 'unique', columns, message: key.message }
      }
      return {
        kind: 'unique',
        columns,
        message: columns.length === 0
          ? `${model}: a value that must be unique is already in use.`
          : `${model}: a record with the same ${columns.join(', ')} already exists.`,
      }
    }
    case 'ForeignKeyConstraintViolation': {
      const index = cause.constraint !== undefined && 'index' in cause.constraint ? cause.constraint.index : undefined
      const known = index === undefined ? undefined : restrictedForeignKeys[index]
      if (known !== undefined) {
        return { kind: 'foreign-key', message: known }
      }
      return {
        kind: 'foreign-key',
        message: index === undefined
          ? `${model}: a related record is missing or still in use.`
          : `${model}: a related record is missing or still in use (${index}).`,
      }
    }
  }
}
