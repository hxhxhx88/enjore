import type { JSX } from 'react'
import type { TranslationRow } from './editor'
import type { ActionOutput } from '@/lib/action-output'
import { LoadingButton } from '@repo/ui-web/loading-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui-web/primitives/alert-dialog'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface Props {
  readonly row: TranslationRow
  readonly onConfirm: () => Promise<ActionOutput>
  readonly onClose: () => void
}

// The editor's own confirmation, so it works inside any page or sheet without the page's modal store.
export function ModalTranslationDelete({ row, onConfirm, onClose }: Props): JSX.Element {
  const [open, setOpen] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: onConfirm,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Translation deleted.' })
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
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this translation?</AlertDialogTitle>
          <AlertDialogDescription>{`The ${row.locale} value "${row.value}" is removed. The canonical value stays.`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton variant="destructive" isLoading={isPending} onClick={() => mutate()}>
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
