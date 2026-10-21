import type { JSX } from 'react'
import { useStore } from './context'
import { ModalEditionEdit } from './modal-edition-edit'

export function ModalController(): JSX.Element | undefined {
  const modalData = useStore(s => s.modalData)

  switch (modalData?.type) {
    case 'edition-edit':
      return <ModalEditionEdit />
    case undefined:
      return undefined
  }
}
