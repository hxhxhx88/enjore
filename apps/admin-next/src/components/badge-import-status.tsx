import type { JSX } from 'react'
import type { ImportStatus } from '@/lib/derive-import-status'
import { Badge } from '@repo/ui-web/primitives/badge'
import { importStatusLabels } from '@/lib/labels'

const variants = {
  'not-imported': 'outline',
  'importing': 'secondary',
  'imported': 'secondary',
  'verified': 'default',
} as const satisfies Record<ImportStatus, 'outline' | 'secondary' | 'default'>

interface Props {
  readonly status: ImportStatus
}

export function BadgeImportStatus({ status }: Props): JSX.Element {
  return <Badge variant={variants[status]}>{importStatusLabels[status]}</Badge>
}
