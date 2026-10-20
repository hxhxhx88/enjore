import type { JSX } from 'react'
import type { ModalDataEditUser } from './context'
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
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useStore } from './context'

export function ModalUserEdit({ data }: { data: ModalDataEditUser }): JSX.Element {
  // Open upon mounting
  const [open, setOpen] = useState(true)
  const setModalData = useStore(s => s.setModalData)

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      // mock the mutation
      await Promise.resolve({ userId })
    },
    onSuccess() {
      // close the modal on success
      setOpen(false)
    },
  })

  return (
    // The modal renders as a dialog.
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          // Unmount once the close animation has finished.
          setModalData(undefined)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="px-4">
          {/* Edit user form omitted. Should populate the form with the user data. */}
        </div>
        <DialogFooter>
          <LoadingButton
            isLoading={isPending}
            className="w-full"
            onClick={() => {
              // Submit the form
              mutate({ userId: data.user.id })
            }}
          >
            Update
          </LoadingButton>
          {/* Base UI composes custom elements through the `render` prop instead of `asChild`. */}
          <DialogClose render={<Button variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
