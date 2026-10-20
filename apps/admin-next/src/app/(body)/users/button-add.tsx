'use client'

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
  SheetTrigger,
} from '@repo/ui-web/primitives/sheet'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { FormProviderUserAdd, FormUserAdd } from '@/components/form-user-add'
import { actionAddUser } from './action-add'

export function ButtonUserAdd(): JSX.Element {
  const [open, setOpen] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  // The server action revalidates the users list, so no client-side refresh is needed.
  const { mutate, isPending } = useMutation({
    mutationFn: actionAddUser,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'User added successfully.' })
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        Add user
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add user</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="px-4">
          <FormProviderUserAdd>
            <FormUserAdd formRef={formRef} onSubmit={mutate} />
          </FormProviderUserAdd>
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
      </SheetContent>
    </Sheet>
  )
}
