import type { JSX } from 'react'
import type { ModalDataFactEdit } from './context'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui-web/primitives/dialog'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { factToFormValues, FormFact, FormProviderFact, toFactValue } from '@/components/form-fact'
import { readFacts } from '@/lib/facts'
import { factLabels } from '@/lib/labels'
import { actionRestaurantFactUpdate } from './action-restaurant-fact-update'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataFactEdit
}

export function ModalFactEdit({ data }: Props): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantFactUpdate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: `${factLabels[data.fact]} saved.` })
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
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setModalData(undefined)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Edit ${factLabels[data.fact].toLowerCase()}`}</DialogTitle>
          <DialogDescription>The fact becomes manual: a refresh from Places leaves it alone from now on.</DialogDescription>
        </DialogHeader>
        <FormProviderFact initialValues={factToFormValues(data.fact, readFacts(restaurant))}>
          <FormFact formRef={formRef} onSubmit={formData => mutate({ restaurantId: restaurant.id, value: toFactValue(formData) })} />
        </FormProviderFact>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <LoadingButton
            isLoading={isPending}
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          >
            Save
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
