import type { BusinessStatus } from '@repo/lib/schemas/business-status'
import type { JSX } from 'react'
import { Badge } from '@repo/ui-web/primitives/badge'
import { businessStatusLabels } from '@/lib/labels'

const variants = {
  'open': 'secondary',
  'temporarily-closed': 'outline',
  'permanently-closed': 'destructive',
} as const satisfies Record<BusinessStatus, 'outline' | 'secondary' | 'destructive'>

interface Props {
  readonly status: BusinessStatus
}

export function BadgeBusinessStatus({ status }: Props): JSX.Element {
  return <Badge variant={variants[status]}>{businessStatusLabels[status]}</Badge>
}
