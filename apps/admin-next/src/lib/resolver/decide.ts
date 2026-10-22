// The resolver's thresholds, in one place so the first real import can tune them
// (`docs/implementation/admin/index.md`, open questions).
export const thresholds = {
  // A Places result is trusted on the name alone at this similarity...
  trustName: 0.8,
  // ...or at this one when the address agrees at least this much.
  trustNameWithAddress: 0.5,
  trustAddress: 0.5,
  // An existing restaurant with this name similarity, this close, blocks automatic creation.
  candidateName: 0.6,
  candidateDistanceMeters: 300,
} as const

export function isTrusted(nameSimilarity: number, addressSimilarity: number | null): boolean {
  if (nameSimilarity >= thresholds.trustName) {
    return true
  }
  return addressSimilarity !== null
    && nameSimilarity >= thresholds.trustNameWithAddress
    && addressSimilarity >= thresholds.trustAddress
}

export interface CandidateScore {
  nameSimilarity: number
  distanceMeters: number | null
  // A branch of a chain is a distinct venue by definition and is shown as such, never as a duplicate.
  inChain: boolean
}

export function isBlocking({ nameSimilarity, distanceMeters, inChain }: CandidateScore): boolean {
  return !inChain
    && distanceMeters !== null
    && distanceMeters <= thresholds.candidateDistanceMeters
    && nameSimilarity >= thresholds.candidateName
}

export interface DecideInput<Place> {
  // The restaurant that already holds the entry's guide listing.
  listingOwner: string | null
  // The trusted place, with the restaurant that already owns its id.
  place: { owner: string | null, facts: Place } | null
  candidates: ReadonlyArray<{ blocking: boolean }>
}

export type Decision<Place>
  = | { type: 'matched', restaurantId: string, via: 'listing' | 'place' }
    | { type: 'new', place: Place }
    | { type: 'unresolved' }

// The decision table of `docs/implementation/admin/0002-restaurants-and-resolution.md`: a listing or a place id
// somebody owns is a match; a trusted place nobody owns with no blocking candidate creates the restaurant; anything
// else waits for the operator. Fuzzy matches are never accepted automatically.
export function decide<Place>({ listingOwner, place, candidates }: DecideInput<Place>): Decision<Place> {
  if (listingOwner !== null) {
    return { type: 'matched', restaurantId: listingOwner, via: 'listing' }
  }
  if (place !== null && place.owner !== null) {
    return { type: 'matched', restaurantId: place.owner, via: 'place' }
  }
  if (place !== null && !candidates.some(candidate => candidate.blocking)) {
    return { type: 'new', place: place.facts }
  }
  return { type: 'unresolved' }
}
