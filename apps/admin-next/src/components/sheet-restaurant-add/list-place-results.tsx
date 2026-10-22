import type { JSX } from 'react'
import type { PlaceResult } from '@/lib/resolver/resolve-entry'
import { Button } from '@repo/ui-web/primitives/button'

interface Props {
  readonly results: readonly PlaceResult[]
  readonly selected: string | null
  readonly onSelect: (placeId: string | null) => void
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

// The text search's results when none was trusted: the operator picks the right one, or none to create the record
// without a Google place.
export function ListPlaceResults({ results, selected, onSelect }: Props): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Google Places results</h3>
      <ul className="flex flex-col divide-y border">
        {results.map((result) => {
          const isSelected = result.placeId === selected
          return (
            <li key={result.placeId} className="flex items-center gap-3 p-3 text-sm">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span>{result.displayName ?? 'Unnamed'}</span>
                <span className="text-muted-foreground">{result.address ?? 'No address'}</span>
                <span className="text-xs text-muted-foreground">
                  {[`Name ${percent(result.nameSimilarity)}`, ...(result.addressSimilarity === null ? [] : [`address ${percent(result.addressSimilarity)}`])].join(' · ')}
                </span>
              </div>
              <Button variant={isSelected ? 'default' : 'outline'} size="sm" onClick={() => onSelect(isSelected ? null : result.placeId)}>
                {isSelected ? 'Selected' : 'Use this place'}
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
