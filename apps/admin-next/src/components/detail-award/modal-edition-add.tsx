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
import { FormAwardEdition, FormProviderAwardEdition } from '@/components/form-award-edition'
import { actionEditionCreate } from './action-edition-create'
import { useProps, useStore } from './context'

export function ModalEditionAdd(): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionEditionCreate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Edition added.' })
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
          <SheetTitle>Add edition</SheetTitle>
          <SheetDescription>One published list of the award. Creating it imports nothing.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FormProviderAwardEdition>
            <FormAwardEdition formRef={formRef} onSubmit={formData => mutate({ awardId: award.id, formData })} />
          </FormProviderAwardEdition>
        </div>
        <SheetFooter>
          <LoadingButton
            isLoading={isPending}
            className="w-full"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          >
            Add
          </LoadingButton>
          <SheetClose render={<Button variant="outline" />}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
