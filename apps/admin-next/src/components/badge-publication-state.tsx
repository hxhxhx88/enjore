import type { JSX } from 'react'
import type { PublicationState } from '@/lib/derive-publication-state'
import { Badge } from '@repo/ui-web/primitives/badge'
import { publicationStateLabels } from '@/lib/labels'

const variants = {
  unpublished: 'outline',
  published: 'default',
  withdrawn: 'secondary',
} as const satisfies Record<PublicationState, 'outline' | 'secondary' | 'default'>

interface Props {
  readonly state: PublicationState
}

export function BadgePublicationState({ state }: Props): JSX.Element {
  return <Badge variant={variants[state]}>{publicationStateLabels[state]}</Badge>
}
