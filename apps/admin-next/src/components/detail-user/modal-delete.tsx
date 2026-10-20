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
import { actionDeleteUser } from './action-delete'
import { useProps, useStore } from './context'

export function ModalDelete(): JSX.Element {
  const { userId } = useProps()

  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)

  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: actionDeleteUser,
    onSuccess() {
      toast.add({ type: 'success', title: 'User deleted successfully.' })
      router.replace(routes.users.list)
    },
  })

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          // Unmount once the close animation has finished.
          setModalData(undefined)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton variant="destructive" isLoading={isPending} onClick={() => mutate({ userId })}>
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
