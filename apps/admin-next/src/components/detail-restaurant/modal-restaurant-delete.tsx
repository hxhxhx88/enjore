import type { JSX } from 'react'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { routes } from '@/lib/routes'
import { actionRestaurantDelete } from './action-restaurant-delete'
import { useProps, useStore } from './context'

export function ModalRestaurantDelete(): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantDelete,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Restaurant deleted.' })
          router.replace(routes.restaurants.list)
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
          setModalData(undefined)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this restaurant?</AlertDialogTitle>
          <AlertDialogDescription>
            {`${restaurant.name} is removed with its profile, draft, artwork, ${restaurant._count.accolades} accolades, ${restaurant._count.sourceReferences} source references and jobs. Import entries that pointed at it become unresolved again. This cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton variant="destructive" isLoading={isPending} onClick={() => mutate({ restaurantId: restaurant.id })}>
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
