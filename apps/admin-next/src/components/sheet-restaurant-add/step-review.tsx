import type { JSX } from 'react'
import type { StepReview as StepReviewData } from './context'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@repo/ui-web/primitives/sheet'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { FormProviderRestaurant, FormRestaurant } from '@/components/form-restaurant'
import { MapStatic } from '@/components/map-static'
import { firstLatinName, slugify } from '@/lib/slug'
import { actionRestaurantCreate } from './action-restaurant-create'
import { useProps, useStore } from './context'
import { ListCandidates } from './list-candidates'
import { ListFacts } from './list-facts'
import { ListPlaceResults } from './list-place-results'

interface Props {
  readonly data: StepReviewData
}

function isText(value: string | null | undefined): value is string {
  return value !== null && value !== undefined && value !== ''
}

// What the resolver found, for the operator to confirm: the Places facts of the trusted or picked place, the
// candidates that may already be the venue, and the identity fields with "Create" or "Create anyway".
export function StepReview({ data }: Props): JSX.Element {
  const { entry, result, placeId } = data
  const { onDone } = useProps()
  const setStep = useStore(s => s.setStep)
  const formRef = useRef<HTMLFormElement>(null)

  // The full facts exist for the trusted place only; a picked result shows what the search returned.
  const place = placeId !== null && result.place?.placeId === placeId ? result.place : null
  const picked = placeId !== null && place === null && result.type === 'unresolved'
    ? result.placeResults.find(candidate => candidate.placeId === placeId)
    : undefined

  const names = [entry.name, ...entry.otherNames.map(other => other.value), place?.displayName, picked?.displayName].filter(isText)
  const latin = firstLatinName(names)
  const initialValues = {
    name: entry.name !== '' ? entry.name : (place?.displayName ?? picked?.displayName ?? ''),
    nameLocale: entry.nameLocale,
    slug: latin === undefined ? '' : slugify(latin),
    region: place?.region ?? entry.region,
    hasPlace: placeId !== null,
    address: entry.address,
  }

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantCreate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({
            type: 'success',
            title: output.existed ? 'This restaurant already exists.' : 'Restaurant created.',
            ...(output.existed ? { description: 'Its Google place already belongs to a record, which is opened instead.' } : {}),
          })
          onDone(output.id)
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  const blocking = result.candidates.filter(candidate => candidate.blocking)

  return (
    <>
      <SheetHeader>
        <SheetTitle>{result.type === 'new' ? 'New restaurant' : 'Not resolved'}</SheetTitle>
        <SheetDescription>
          {result.type === 'new'
            ? 'Google Places found the venue and nothing nearby looks like it. Confirm the names and create it.'
            : blocking.length > 0
              ? 'A restaurant nearby looks like this one. Open it instead, or create a new record anyway.'
              : 'No Google Places result was a confident match. Pick one, or create the record without a place.'}
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4">
        {result.type === 'unresolved' && result.placeResults.length > 0 && (
          <ListPlaceResults
            results={result.placeResults}
            selected={placeId}
            onSelect={id => setStep({ ...data, placeId: id })}
          />
        )}
        {place !== null && <ListFacts place={place} />}
        {picked !== undefined && (
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Picked place</h3>
            <p className="text-sm">{picked.displayName ?? 'Unnamed'}</p>
            <p className="text-sm text-muted-foreground">{picked.address ?? 'No address'}</p>
            {picked.coordinates !== null && <MapStatic latitude={picked.coordinates.latitude} longitude={picked.coordinates.longitude} />}
            <p className="text-xs text-muted-foreground">Phone, website, hours and status are fetched when the restaurant is created.</p>
          </section>
        )}
        {result.candidates.length > 0 && <ListCandidates candidates={result.candidates} />}
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Identity</h3>
          <FormProviderRestaurant initialValues={initialValues}>
            <FormRestaurant formRef={formRef} onSubmit={formData => mutate({ placeId, otherNames: entry.otherNames, formData })} />
          </FormProviderRestaurant>
          {entry.otherNames.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {`Other names: ${entry.otherNames.map(other => `${other.value} (${other.locale})`).join(', ')}`}
            </p>
          )}
        </section>
      </div>
      <SheetFooter>
        <LoadingButton
          isLoading={isPending}
          className="w-full"
          onClick={() => {
            formRef.current?.requestSubmit()
          }}
        >
          {result.type === 'new' ? 'Create' : 'Create anyway'}
        </LoadingButton>
        <Button variant="outline" onClick={() => setStep({ type: 'entry', initialValues: entry })}>
          Back
        </Button>
      </SheetFooter>
    </>
  )
}
