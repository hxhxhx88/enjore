import { describe, expect, it } from 'vitest'
import { parseDatabaseError, violatesUniqueKey } from '@/lib/db-error'

// The shape `PrismaClientKnownRequestError` has at runtime with a driver adapter: `meta` carries the adapter's error.
function prismaError(modelName: string | undefined, cause: Record<string, unknown>): unknown {
  return {
    name: 'PrismaClientKnownRequestError',
    code: 'P2002',
    clientVersion: '7.9.1',
    meta: { modelName, driverAdapterError: { name: 'DriverAdapterError', cause } },
  }
}

function uniqueViolation(modelName: string | undefined, fields: string[]): unknown {
  return prismaError(modelName, { kind: 'UniqueConstraintViolation', constraint: { fields } })
}

function foreignKeyViolation(modelName: string, constraint: Record<string, unknown> | undefined): unknown {
  return prismaError(modelName, { kind: 'ForeignKeyConstraintViolation', constraint })
}

describe('parseDatabaseError', () => {
  it('names the known unique keys by their columns', () => {
    expect(parseDatabaseError(uniqueViolation('Award', ['slug']))).toEqual({ kind: 'unique', columns: ['slug'], message: 'Slug already in use.' })
    expect(parseDatabaseError(uniqueViolation('AwardTier', ['award_id', 'name']))?.message).toBe('A tier with this name already exists in this award.')
    expect(parseDatabaseError(uniqueViolation('AwardEdition', ['award_id', 'label']))?.message).toBe('An edition with this label already exists in this award.')
    expect(parseDatabaseError(uniqueViolation('Accolade', ['restaurant_id', 'edition_id', 'tier_id']))?.message).toBe('This restaurant already holds this tier in this edition.')
  })

  it('matches a nested write on its columns, not on the outer model', () => {
    expect(parseDatabaseError(uniqueViolation('Award', ['award_id', 'name']))?.message).toBe('A tier with this name already exists in this award.')
  })

  it('strips the quotes Postgres puts around reserved column names', () => {
    const error = parseDatabaseError(uniqueViolation('Translation', ['locale', '"table"', 'record_id', 'field']))
    expect(error?.message).toBe('A translation for this field already exists in this locale.')
    expect(error !== undefined && violatesUniqueKey(error, ['locale', 'table', 'record_id', 'field'])).toBe(true)
  })

  it('tells one unique key from another by its columns', () => {
    const error = parseDatabaseError(uniqueViolation('Restaurant', ['google_place_ref']))
    expect(error !== undefined && violatesUniqueKey(error, ['google_place_ref'])).toBe(true)
    expect(error !== undefined && violatesUniqueKey(error, ['slug'])).toBe(false)
    const foreignKey = parseDatabaseError(foreignKeyViolation('Award', { index: 'x_fkey' }))
    expect(foreignKey !== undefined && violatesUniqueKey(foreignKey, [])).toBe(false)
  })

  it('uses the model to tell apart keys with the same columns', () => {
    expect(parseDatabaseError(uniqueViolation('RestaurantProfile', ['restaurant_id']))?.message).toBe('This restaurant already has a published profile.')
    expect(parseDatabaseError(uniqueViolation('RestaurantProfileDraft', ['restaurant_id']))?.message).toBe('This restaurant already has a draft.')
  })

  it('falls back to naming the model and the columns', () => {
    expect(parseDatabaseError(uniqueViolation('Chain', ['foo', 'bar']))?.message).toBe('Chain: a record with the same foo, bar already exists.')
    expect(parseDatabaseError(uniqueViolation(undefined, ['foo']))?.message).toBe('Record: a record with the same foo already exists.')
    expect(parseDatabaseError(prismaError('Chain', { kind: 'UniqueConstraintViolation' }))?.message).toBe('Chain: a value that must be unique is already in use.')
  })

  it('names the restricted foreign keys by their constraint', () => {
    expect(parseDatabaseError(foreignKeyViolation('Award', { index: 'accolades_award_id_edition_id_fkey' }))).toEqual({
      kind: 'foreign-key',
      message: 'This edition has accolades and cannot be deleted.',
    })
    expect(parseDatabaseError(foreignKeyViolation('AwardTier', { index: 'accolades_award_id_tier_id_fkey' }))?.message).toBe('This tier has accolades and cannot be deleted.')
  })

  it('falls back for unknown foreign keys with and without a constraint name', () => {
    expect(parseDatabaseError(foreignKeyViolation('Award', { index: 'x_fkey' }))?.message).toBe('Award: a related record is missing or still in use (x_fkey).')
    expect(parseDatabaseError(foreignKeyViolation('Award', { fields: ['award_id'] }))?.message).toBe('Award: a related record is missing or still in use.')
    expect(parseDatabaseError(foreignKeyViolation('Award', undefined))?.message).toBe('Award: a related record is missing or still in use.')
  })

  it('accepts an Error instance carrying the Prisma meta', () => {
    class FakePrismaError extends Error {
      meta = {
        modelName: 'Award',
        driverAdapterError: { cause: { kind: 'UniqueConstraintViolation', constraint: { fields: ['slug'] } } },
      }
    }

    expect(parseDatabaseError(new FakePrismaError('unique constraint failed'))?.message).toBe('Slug already in use.')
  })

  it('returns undefined for anything else', () => {
    expect(parseDatabaseError(new Error('boom'))).toBeUndefined()
    expect(parseDatabaseError(null)).toBeUndefined()
    expect(parseDatabaseError('oops')).toBeUndefined()
    expect(parseDatabaseError(prismaError('Award', { kind: 'NullConstraintViolation' }))).toBeUndefined()
  })
})
