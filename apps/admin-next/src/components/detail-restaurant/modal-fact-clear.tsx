import type { JSX } from 'react'
import type { ModalDataFactClear } from './context'
import { LoadingButton } from '@repo/ui-web/loading-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui-web/primitives/alert-dialog'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { factLabels } from '@/lib/labels'
import { actionRestaurantFactClear } from './action-restaurant-fact-clear'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataFactClear
}

export function ModalFactClear({ data }: Props): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantFactClear,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: `${factLabels[data.fact]} cleared.` })
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
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setModalData(undefined)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Clear ${factLabels[data.fact].toLowerCase()}?`}</AlertDialogTitle>
          <AlertDialogDescription>
            The fact becomes empty with a manual origin, so a refresh from Places does not fill it again. Edit it
            later to set a value.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton variant="destructive" isLoading={isPending} onClick={() => mutate({ restaurantId: restaurant.id, fact: data.fact })}>
            Clear
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
