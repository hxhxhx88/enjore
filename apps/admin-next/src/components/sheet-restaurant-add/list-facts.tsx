import type { JSX } from 'react'
import type { PlaceFacts } from '@/lib/places/map-facts'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { MapStatic } from '@/components/map-static'
import { formatCoordinates } from '@/lib/facts'
import { businessStatusLabels, regionLabel } from '@/lib/labels'
import { formatOpeningHours } from '@/lib/opening-hours-text'

interface Props {
  readonly place: PlaceFacts
}

// The facts a place gives the restaurant, read-only; the "Basics" section edits them after creation.
export function ListFacts({ place }: Props): JSX.Element {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">Google Places</h3>
      <DescriptionList>
        <DescriptionItem term="Name">{place.displayName ?? '–'}</DescriptionItem>
        <DescriptionItem term="Region">{place.region === null ? '–' : regionLabel(place.region)}</DescriptionItem>
        <DescriptionItem term="Address">{place.address ?? '–'}</DescriptionItem>
        <DescriptionItem term="District">{place.district ?? '–'}</DescriptionItem>
        <DescriptionItem term="Coordinates">{place.coordinates === null ? '–' : formatCoordinates(place.coordinates)}</DescriptionItem>
        <DescriptionItem term="Phone">{place.phone ?? '–'}</DescriptionItem>
        <DescriptionItem term="Website">{place.website ?? '–'}</DescriptionItem>
        <DescriptionItem term="Opening hours">
          {place.openingHours === null ? '–' : <span className="whitespace-pre-line">{formatOpeningHours(place.openingHours)}</span>}
        </DescriptionItem>
        <DescriptionItem term="Business status">{place.businessStatus === null ? '–' : businessStatusLabels[place.businessStatus]}</DescriptionItem>
      </DescriptionList>
      {place.coordinates !== null && <MapStatic latitude={place.coordinates.latitude} longitude={place.coordinates.longitude} />}
    </section>
  )
}
