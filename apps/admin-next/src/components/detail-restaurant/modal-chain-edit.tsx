import type { JSX } from 'react'
import type { ModalDataChainEdit } from './context'
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
import { FormChain, FormProviderChain } from '@/components/form-chain'
import { actionChainUpdate } from './action-chain-update'
import { useStore } from './context'

interface Props {
  readonly data: ModalDataChainEdit
}

export function ModalChainEdit({ data }: Props): JSX.Element {
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionChainUpdate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Chain saved.' })
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
          <SheetTitle>Edit chain</SheetTitle>
          <SheetDescription>{`${data.chain.name}, shared by its ${data.chain._count.restaurants} branches.`}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          <FormProviderChain initialValues={{ name: data.chain.name, nameLocale: data.chain.nameLocale, slug: data.chain.slug }}>
            <FormChain formRef={formRef} onSubmit={formData => mutate({ chainId: data.chain.id, formData })} />
          </FormProviderChain>
        </div>
        <SheetFooter>
          <LoadingButton
            isLoading={isPending}
            className="w-full"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          >
            Save
          </LoadingButton>
          <SheetClose render={<Button variant="outline" />}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
