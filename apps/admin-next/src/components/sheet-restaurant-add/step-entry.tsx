import type { JSX } from 'react'
import type { FormTypeRestaurantEntry } from '@/components/form-restaurant-entry'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import { SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@repo/ui-web/primitives/sheet'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { FormProviderRestaurantEntry, FormRestaurantEntry } from '@/components/form-restaurant-entry'
import { actionRestaurantResolve } from './action-restaurant-resolve'
import { useProps, useStore } from './context'

interface Props {
  readonly initialValues: FormTypeRestaurantEntry | undefined
}

export function StepEntry({ initialValues }: Props): JSX.Element {
  const { onDone } = useProps()
  const setStep = useStore(s => s.setStep)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantResolve,
    onSuccess(output, entry) {
      if (output.type === 'bad') {
        toast.add({ type: 'warning', title: output.message })
        return
      }
      const { result } = output
      switch (result.type) {
        case 'matched': {
          toast.add({
            type: 'success',
            title: 'This restaurant already exists.',
            description: result.via === 'listing' ? 'The guide listing belongs to it.' : 'The Google place belongs to it.',
          })
          onDone(result.restaurantId)
          break
        }
        case 'new': {
          setStep({ type: 'review', entry, result, placeId: result.place.placeId })
          break
        }
        case 'unresolved': {
          setStep({ type: 'review', entry, result, placeId: result.place?.placeId ?? null })
          break
        }
      }
    },
  })

  return (
    <>
      <SheetHeader>
        <SheetTitle>Add restaurant</SheetTitle>
        <SheetDescription>
          A name and an address, or a Google Maps link. The resolver looks the venue up in Google Places and checks
          whether it already exists.
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-4">
        <FormProviderRestaurantEntry initialValues={initialValues}>
          <FormRestaurantEntry formRef={formRef} onSubmit={mutate} />
        </FormProviderRestaurantEntry>
      </div>
      <SheetFooter>
        <LoadingButton
          isLoading={isPending}
          className="w-full"
          onClick={() => {
            formRef.current?.requestSubmit()
          }}
        >
          Resolve
        </LoadingButton>
        <SheetClose render={<Button variant="outline" />}>
          Close
        </SheetClose>
      </SheetFooter>
    </>
  )
}
