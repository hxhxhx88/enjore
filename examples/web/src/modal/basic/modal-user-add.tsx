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
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useStore } from './context'

export function ModalUserAdd(): JSX.Element {
  // Open upon mounting
  const [open, setOpen] = useState(true)
  const setModalData = useStore(s => s.setModalData)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // mock the mutation
      await Promise.resolve()
    },
    onSuccess() {
      // close the modal on success
      setOpen(false)
    },
  })

  return (
    // The modal renders as a sheet.
    <Sheet
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          // Unmount once the close animation has finished.
          setModalData(undefined)
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add user</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="px-4">
          {/* Add user form omitted */}
        </div>
        <SheetFooter>
          <LoadingButton
            isLoading={isPending}
            className="w-full"
            onClick={() => {
              // Submit the form
              mutate()
            }}
          >
            Create
          </LoadingButton>
          {/* Base UI composes custom elements through the `render` prop instead of `asChild`. */}
          <SheetClose render={<Button variant="outline" />}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
