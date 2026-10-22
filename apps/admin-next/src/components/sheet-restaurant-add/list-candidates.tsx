import type { JSX } from 'react'
import type { CandidateView } from '@/lib/resolver/candidates'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { routes } from '@/lib/routes'

interface Props {
  readonly candidates: readonly CandidateView[]
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

// Existing restaurants that may be this venue. A branch of a chain is a distinct venue and is labelled as such
// rather than as a duplicate; the others are warnings the operator weighs before creating.
export function ListCandidates({ candidates }: Props): JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Existing restaurants nearby</h3>
      <ul className="flex flex-col divide-y border">
        {candidates.map(candidate => (
          <li key={candidate.restaurantId} className="flex flex-col gap-1 p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="link"
                nativeButton={false}
                className="h-auto p-0"
                render={<Link href={routes.restaurants.detail(candidate.restaurantId)} target="_blank" />}
              >
                {candidate.name}
              </Button>
              <span className="text-xs text-muted-foreground">{candidate.nameLocale}</span>
              {candidate.chain !== null
                ? <Badge variant="secondary">{`Branch of ${candidate.chain.name}`}</Badge>
                : candidate.blocking
                  ? <Badge variant="destructive">Possible duplicate</Badge>
                  : <Badge variant="outline">Nearby</Badge>}
            </div>
            <p className="text-muted-foreground">{candidate.address ?? 'No address'}</p>
            <p className="text-xs text-muted-foreground">
              {[
                `Name ${percent(candidate.nameSimilarity)}`,
                ...(candidate.addressSimilarity === undefined ? [] : [`address ${percent(candidate.addressSimilarity)}`]),
                ...(candidate.distanceMeters === undefined ? [] : [`${candidate.distanceMeters} m away`]),
              ].join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
