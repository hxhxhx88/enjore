import type { JSX } from 'react'
import type { ReadUserOutput } from './action-read'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { LoadingSkeleton } from '@repo/ui-web/loading-skeleton'
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
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { FormProviderUserEdit, FormUserEdit } from '@/components/form-user-edit'
import { actionEditUser } from './action-edit'
import { actionReadUser } from './action-read'
import { useProps, useStore } from './context'

export function ModalEdit(): JSX.Element {
  const { userId } = useProps()

  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => actionReadUser({ userId }),
    gcTime: 0,
  })

  return (
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
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        {data ? <Loaded data={data} onSuccess={() => setOpen(false)} /> : <LoadingSkeleton className="px-4" />}
      </SheetContent>
    </Sheet>
  )
}

interface Props {
  data: ReadUserOutput
  onSuccess: () => void
}

function Loaded({ data, onSuccess }: Props): JSX.Element {
  const { userId } = useProps()
  const formRef = useRef<HTMLFormElement>(null)

  // The server action revalidates the affected pages, so no client-side refresh is needed.
  const { mutate, isPending } = useMutation({
    mutationFn: actionEditUser,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'User edited successfully.' })
          onSuccess()
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
    <>
      <div className="px-4">
        <FormProviderUserEdit initialValues={data}>
          <FormUserEdit formRef={formRef} onSubmit={formData => mutate({ userId, formData })} />
        </FormProviderUserEdit>
      </div>
      <SheetFooter>
        <LoadingButton
          isLoading={isPending}
          className="w-full"
          onClick={() => {
            formRef.current?.requestSubmit()
          }}
        >
          Confirm
        </LoadingButton>
        <SheetClose render={<Button variant="outline" />}>
          Close
        </SheetClose>
      </SheetFooter>
    </>
  )
}
