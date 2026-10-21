import type { JSX } from 'react'
import { useStore } from './context'
import { ModalAwardActive } from './modal-award-active'
import { ModalAwardDelete } from './modal-award-delete'
import { ModalAwardEdit } from './modal-award-edit'
import { ModalEditionAdd } from './modal-edition-add'
import { ModalEditionEdit } from './modal-edition-edit'
import { ModalTierAdd } from './modal-tier-add'
import { ModalTierDelete } from './modal-tier-delete'
import { ModalTierEdit } from './modal-tier-edit'

export function ModalController(): JSX.Element | undefined {
  const modalData = useStore(s => s.modalData)

  switch (modalData?.type) {
    case 'award-edit':
      return <ModalAwardEdit />
    case 'award-active':
      return <ModalAwardActive data={modalData} />
    case 'award-delete':
      return <ModalAwardDelete />
    case 'tier-add':
      return <ModalTierAdd />
    case 'tier-edit':
      return <ModalTierEdit data={modalData} />
    case 'tier-delete':
      return <ModalTierDelete data={modalData} />
    case 'edition-add':
      return <ModalEditionAdd />
    case 'edition-edit':
      return <ModalEditionEdit data={modalData} />
    case undefined:
      return undefined
  }
}
