import type { JSX } from 'react'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { routes } from '@/lib/routes'
import { actionAwardDelete } from './action-award-delete'
import { useProps, useStore } from './context'

export function ModalAwardDelete(): JSX.Element {
  const { award, accoladeCount } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: actionAwardDelete,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Award deleted.' })
          router.replace(routes.awards.list)
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  // The database refuses the delete while accolades or source references point at the award.
  const referenced = accoladeCount > 0 || award._count.sourceReferences > 0

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
          <AlertDialogTitle>{referenced ? 'This award cannot be deleted' : 'Delete this award?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {referenced
              ? `${accoladeCount} accolades and ${award._count.sourceReferences} source references point at it. Deactivate it instead.`
              : `Its ${award.tiers.length} tiers and ${award.editions.length} editions are deleted with it. This cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{referenced ? 'Close' : 'Cancel'}</AlertDialogCancel>
          {!referenced && (
            <LoadingButton variant="destructive" isLoading={isPending} onClick={() => mutate({ awardId: award.id })}>
              Delete
            </LoadingButton>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
