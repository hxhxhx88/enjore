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
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { FormAward, FormProviderAward } from '@/components/form-award'
import { routes } from '@/lib/routes'
import { actionAwardCreate } from './action-award-create'

export function ButtonAwardAdd(): JSX.Element {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // The action revalidates the list; the operator lands on the new award to add its tiers and editions.
  const { mutate, isPending } = useMutation({
    mutationFn: actionAwardCreate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Award created.' })
          setOpen(false)
          router.push(routes.awards.detail(output.id))
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
        Add award
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Add award</SheetTitle>
          <SheetDescription>A source such as a guide or a list, with the facets its accolades carry.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FormProviderAward>
            <FormAward formRef={formRef} onSubmit={mutate} />
          </FormProviderAward>
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
