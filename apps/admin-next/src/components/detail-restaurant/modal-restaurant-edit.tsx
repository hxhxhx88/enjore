import type { JSX } from 'react'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@repo/ui-web/primitives/sheet'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { FormProviderRestaurant, FormRestaurant } from '@/components/form-restaurant'
import { actionRestaurantUpdate } from './action-restaurant-update'
import { useProps, useStore } from './context'

export function ModalRestaurantEdit(): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantUpdate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Restaurant saved.' })
          setOpen(false)
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setModalData(undefined)
        }
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit restaurant</SheetTitle>
          <SheetDescription>The canonical name, its language, the slug and the region. The facts are edited in "Basics".</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FormProviderRestaurant
            initialValues={{
              name: restaurant.name,
              nameLocale: restaurant.nameLocale,
              slug: restaurant.slug,
              region: restaurant.region,
              hasPlace: true,
              address: '',
            }}
          >
            <FormRestaurant formRef={formRef} onSubmit={formData => mutate({ restaurantId: restaurant.id, formData })} />
          </FormProviderRestaurant>
        </div>
        <SheetFooter>
          <LoadingButton
            isLoading={isPending}
            className="w-full"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          >
            Save
          </LoadingButton>
          <SheetClose render={<Button variant="outline" />}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
