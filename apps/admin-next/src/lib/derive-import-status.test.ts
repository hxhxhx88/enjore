import { describe, expect, it } from 'vitest'
import { deriveImportStatus, importStatusSchema } from '@/lib/derive-import-status'

const date = new Date('2026-10-21T00:00:00Z')

describe('deriveImportStatus', () => {
  it('derives every status from the timestamps and the job flag', () => {
    expect(deriveImportStatus({ importedAt: null, verifiedAt: null })).toBe('not-imported')
    expect(deriveImportStatus({ importedAt: null, verifiedAt: null }, true)).toBe('importing')
    expect(deriveImportStatus({ importedAt: date, verifiedAt: null })).toBe('imported')
    expect(deriveImportStatus({ importedAt: date, verifiedAt: date })).toBe('verified')
  })

  it('lets a timestamp win over a running import', () => {
    expect(deriveImportStatus({ importedAt: date, verifiedAt: null }, true)).toBe('imported')
    expect(deriveImportStatus({ importedAt: null, verifiedAt: date }, true)).toBe('verified')
  })

  it('only produces values of the enum', () => {
    for (const edition of [
      { importedAt: null, verifiedAt: null },
      { importedAt: date, verifiedAt: null },
      { importedAt: date, verifiedAt: date },
    ]) {
      expect(importStatusSchema.safeParse(deriveImportStatus(edition, true)).success).toBe(true)
    }
  })
})
