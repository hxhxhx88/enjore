import type { JSX } from 'react'
import { useStore } from './context'
import { ModalChainCreate } from './modal-chain-create'
import { ModalChainEdit } from './modal-chain-edit'
import { ModalFactClear } from './modal-fact-clear'
import { ModalFactEdit } from './modal-fact-edit'
import { ModalRestaurantDelete } from './modal-restaurant-delete'
import { ModalRestaurantEdit } from './modal-restaurant-edit'

export function ModalController(): JSX.Element | undefined {
  const modalData = useStore(s => s.modalData)

  switch (modalData?.type) {
    case 'restaurant-edit':
      return <ModalRestaurantEdit />
    case 'restaurant-delete':
      return <ModalRestaurantDelete />
    case 'fact-edit':
      return <ModalFactEdit data={modalData} />
    case 'fact-clear':
      return <ModalFactClear data={modalData} />
    case 'chain-create':
      return <ModalChainCreate data={modalData} />
    case 'chain-edit':
      return <ModalChainEdit data={modalData} />
    case undefined:
      return undefined
  }
}
