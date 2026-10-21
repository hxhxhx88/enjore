import type { JSX } from 'react'
import type { ModalDataTierDelete } from './context'
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
import { actionTierDelete } from './action-tier-delete'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataTierDelete
}

export function ModalTierDelete({ data }: Props): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: actionTierDelete,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Tier deleted.' })
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
          <AlertDialogTitle>Delete this tier?</AlertDialogTitle>
          <AlertDialogDescription>
            {`${data.tier.name} is removed from the award. A tier held by accolades cannot be deleted.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            isLoading={isPending}
            onClick={() => mutate({ awardId: award.id, tierId: data.tier.id })}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
