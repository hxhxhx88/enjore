import type { JSX } from 'react'
import { cn } from './lib/utils'
import { Mark } from './mark'

interface Tier {
  readonly glyphKey: string
  readonly glyphCount: number
}

interface Props {
  readonly tier?: Tier | undefined
  readonly rank?: number | undefined
  readonly score?: number | undefined
  readonly scoreMax?: number | undefined
  readonly label?: string | undefined
  readonly className?: string | undefined
}

const numberFormat = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })

// The mark of one accolade from its facets: the tier's drawing, a rank such as #7, a score such as 97.5/100, a named
// prize. A plain membership, with no facet at all, shows the generic mark. The award's name and year are the caller's.
export function MarkAccolade({ tier, rank, score, scoreMax, label, className }: Props): JSX.Element {
  const hasFacet = tier !== undefined || rank !== undefined || score !== undefined || label !== undefined

  return (
    <span className={cn('inline-flex items-center gap-2 tabular-nums', className)}>
      {tier !== undefined && <Mark glyphKey={tier.glyphKey} count={tier.glyphCount} />}
      {rank !== undefined && <span className="font-medium">{`#${rank}`}</span>}
      {score !== undefined && (
        <span className="font-medium">
          {scoreMax === undefined ? numberFormat.format(score) : `${numberFormat.format(score)}/${numberFormat.format(scoreMax)}`}
        </span>
      )}
      {label !== undefined && <span className="text-muted-foreground">{label}</span>}
      {!hasFacet && <Mark glyphKey="generic" count={1} />}
    </span>
  )
}
