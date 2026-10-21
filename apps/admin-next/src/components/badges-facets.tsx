import type { JSX } from 'react'
import type { Facet } from '@/lib/labels'
import { Badge } from '@repo/ui-web/primitives/badge'
import { facetLabels, facets } from '@/lib/labels'

interface Props {
  readonly hasTier: boolean
  readonly hasRank: boolean
  readonly hasLabel: boolean
  readonly scoreMax: number | null
}

// One badge per facet the award declares. An award that declares none hands out plain memberships.
export function BadgesFacets({ hasTier, hasRank, hasLabel, scoreMax }: Props): JSX.Element {
  const declared: Readonly<Record<Facet, boolean>> = { tier: hasTier, rank: hasRank, score: scoreMax !== null, label: hasLabel }
  const shown = facets.filter(facet => declared[facet])

  if (shown.length === 0) {
    return <Badge variant="outline">Membership</Badge>
  }

  return (
    <span className="inline-flex flex-wrap gap-1">
      {shown.map(facet => (
        <Badge key={facet} variant="secondary">
          {facetLabels[facet]}
        </Badge>
      ))}
    </span>
  )
}
