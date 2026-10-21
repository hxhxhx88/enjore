'use client'

import type { StoreApi, UseBoundStore } from 'zustand'
import type { AwardDetail, EditionRow, TierRow } from './select'
import { createContext, use } from 'react'
import { create, useStore as useStore_ } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ModalDataAwardEdit {
  type: 'award-edit'
}

export interface ModalDataAwardActive {
  type: 'award-active'
  // The state to set.
  isActive: boolean
}

interface ModalDataAwardDelete {
  type: 'award-delete'
}

interface ModalDataTierAdd {
  type: 'tier-add'
}

export interface ModalDataTierEdit {
  type: 'tier-edit'
  tier: TierRow
}

export interface ModalDataTierDelete {
  type: 'tier-delete'
  tier: TierRow
}

interface ModalDataEditionAdd {
  type: 'edition-add'
}

export interface ModalDataEditionEdit {
  type: 'edition-edit'
  edition: EditionRow
}

// One field for the open modal keeps at most one open at a time (`docs/development/0003-coding/modal.md`).
type ModalData
  = | ModalDataAwardEdit
    | ModalDataAwardActive
    | ModalDataAwardDelete
    | ModalDataTierAdd
    | ModalDataTierEdit
    | ModalDataTierDelete
    | ModalDataEditionAdd
    | ModalDataEditionEdit

export interface State {
  modalData: ModalData | undefined
  setModalData: (modalData: ModalData | undefined) => void
}

export function createStore(): UseBoundStore<StoreApi<State>> {
  return create(
    immer<State>((set) => {
      return {
        modalData: undefined,
        setModalData(modalData: ModalData | undefined) {
          set((s) => {
            s.modalData = modalData
          })
        },
      }
    }),
  )
}

export const StoreContext = createContext<ReturnType<typeof createStore> | undefined>(undefined)

export function useStore<U>(selector: (state: State) => U): U {
  const store = use(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within StoreContext')
  }

  return useStore_(store, selector)
}

// The page loads the award once and passes it down; every action revalidates the page, so the props stay fresh.
export interface Props {
  award: AwardDetail
  accoladeCount: number
}

export const PropsContext = createContext<Props | undefined>(undefined)

export function useProps(): Props {
  const props = use(PropsContext)
  if (!props) {
    throw new Error('useProps must be used within PropsContext')
  }

  return props
}
