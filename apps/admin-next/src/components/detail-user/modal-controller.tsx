import type { JSX } from 'react'
import { useStore } from './context'
import { ModalDelete } from './modal-delete'
import { ModalEdit } from './modal-edit'

export function ModalController(): JSX.Element | undefined {
  const modalData = useStore(s => s.modalData)

  if (!modalData) {
    return undefined
  }

  switch (modalData.type) {
    case 'edit': {
      return <ModalEdit />
    }

    case 'delete': {
      return <ModalDelete />
    }
  }
}
