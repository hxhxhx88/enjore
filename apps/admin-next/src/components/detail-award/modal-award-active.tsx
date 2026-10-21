import type { JSX } from 'react'
import type { ModalDataAwardActive } from './context'
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
import { actionAwardSetActive } from './action-award-set-active'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataAwardActive
}

export function ModalAwardActive({ data }: Props): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: actionAwardSetActive,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: data.isActive ? 'Award activated.' : 'Award deactivated.' })
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
          <AlertDialogTitle>{data.isActive ? 'Activate this award?' : 'Deactivate this award?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {data.isActive
              ? 'It is offered again when adding accolades.'
              : 'It stays in the database with its accolades and is no longer offered when adding one.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton isLoading={isPending} onClick={() => mutate({ awardId: award.id, isActive: data.isActive })}>
            {data.isActive ? 'Activate' : 'Deactivate'}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
