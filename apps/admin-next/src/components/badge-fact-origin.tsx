import type { FactOrigin } from '@repo/lib/schemas/fact-origin'
import type { JSX } from 'react'
import { Badge } from '@repo/ui-web/primitives/badge'
import { factOriginLabels } from '@/lib/labels'

const variants = {
  'google-places': 'secondary',
  'agent': 'outline',
  'manual': 'default',
} as const satisfies Record<FactOrigin, 'outline' | 'secondary' | 'default'>

interface Props {
  readonly origin: FactOrigin
}

// Where a fact came from: Google Places facts are refreshed, agent and manual facts are never touched by a refresh.
export function BadgeFactOrigin({ origin }: Props): JSX.Element {
  return <Badge variant={variants[origin]}>{factOriginLabels[origin]}</Badge>
}
