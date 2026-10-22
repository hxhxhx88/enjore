import type { JSX } from 'react'
import type { ModalDataChainCreate } from './context'
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
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { FormChain, FormProviderChain } from '@/components/form-chain'
import { actionChainCreate } from './action-chain-create'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataChainCreate
}

export function ModalChainCreate({ data }: Props): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionChainCreate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Chain created and set.' })
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
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setModalData(undefined)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create chain</DialogTitle>
          <DialogDescription>{`A brand whose branches are restaurants; ${restaurant.name} becomes its first one here.`}</DialogDescription>
        </DialogHeader>
        <FormProviderChain initialValues={{ name: data.name, nameLocale: restaurant.nameLocale }}>
          <FormChain formRef={formRef} onSubmit={formData => mutate({ restaurantId: restaurant.id, formData })} />
        </FormProviderChain>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <LoadingButton
            isLoading={isPending}
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          >
            Create
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
