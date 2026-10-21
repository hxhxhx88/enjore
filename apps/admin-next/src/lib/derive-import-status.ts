import type { AwardEdition } from '@repo/db'
import { z } from 'zod'

export const importStatuses = ['not-imported', 'importing', 'imported', 'verified'] as const
export const importStatusSchema = z.enum(importStatuses)
export type ImportStatus = (typeof importStatuses)[number]

// The import status of an edition is derived, never stored (see the `AwardEdition` comment in the schema): verified
// when `verifiedAt` is set, else imported when `importedAt` is set, else importing while an unfinished import job
// targets the edition, else not imported. Jobs arrive in milestone 0005, so `importing` defaults to false until then.
export function deriveImportStatus(edition: Pick<AwardEdition, 'importedAt' | 'verifiedAt'>, importing = false): ImportStatus {
  if (edition.verifiedAt !== null) {
    return 'verified'
  }
  if (edition.importedAt !== null) {
    return 'imported'
  }
  if (importing) {
    return 'importing'
  }
  return 'not-imported'
}
