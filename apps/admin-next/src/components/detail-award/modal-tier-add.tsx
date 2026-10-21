import type { JSX } from 'react'
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
import { actionTierCreate } from './action-tier-create'
import { useProps, useStore } from './context'

export function ModalTierAdd(): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: actionTierCreate,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Tier added.' })
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
          <DialogTitle>Add tier</DialogTitle>
          <DialogDescription>A distinction the award hands out year after year, with the mark that renders it.</DialogDescription>
        </DialogHeader>
        <FormProviderAwardTier initialValues={{ level: award.tiers.length + 1 }}>
          <FormAwardTier formRef={formRef} onSubmit={formData => mutate({ awardId: award.id, formData })} />
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
            Add
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
