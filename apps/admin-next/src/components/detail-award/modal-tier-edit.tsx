import type { JSX } from 'react'
import type { ModalDataTierEdit } from './context'
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
import { FormAwardTier, FormProviderAwardTier } from '@/components/form-award-tier'
import { actionTierUpdate } from './action-tier-update'
import { useProps, useStore } from './context'

interface Props {
  readonly data: ModalDataTierEdit
}

export function ModalTierEdit({ data }: Props): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const { id: tierId, name, level, glyphKey, glyphCount } = data.tier

  const { mutate, isPending } = useMutation({
    mutationFn: actionTierUpdate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Tier saved.' })
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
          <DialogTitle>Edit tier</DialogTitle>
          <DialogDescription>{name}</DialogDescription>
        </DialogHeader>
        <FormProviderAwardTier initialValues={{ name, level, glyphKey, glyphCount }}>
          <FormAwardTier formRef={formRef} onSubmit={formData => mutate({ awardId: award.id, tierId, formData })} />
        </FormProviderAwardTier>
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
            Save
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
