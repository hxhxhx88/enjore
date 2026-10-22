import type { JSX } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@repo/ui-web/primitives/combobox'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { actionRestaurantChainSet } from './action-restaurant-chain-set'
import { useProps, useStore } from './context'

interface ChainItem {
  id: string
  name: string
  // Set on the one synthetic item that offers to create the typed name.
  creatable?: string
}

// A combobox over the existing chains; a typed name that matches none offers to create it, which opens the chain
// form prefilled and attaches the new chain to this restaurant.
export function PickerChain(): JSX.Element {
  const { restaurant, chains } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const [query, setQuery] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: actionRestaurantChainSet,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Chain set.' })
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  const options: ChainItem[] = chains.map(chain => ({ id: chain.id, name: chain.name }))
  const selected = options.find(option => option.id === restaurant.chain?.id) ?? null
  const typed = query.trim()
  const exists = options.some(option => option.name.toLowerCase() === typed.toLowerCase())
  const items: ChainItem[] = typed === '' || exists
    ? options
    : [...options, { id: `create:${typed}`, name: `Create "${typed}"`, creatable: typed }]

  return (
    <Combobox
      items={items}
      value={selected}
      isItemEqualToValue={(a, b) => a.id === b.id}
      itemToStringLabel={item => item.name}
      onInputValueChange={value => setQuery(value)}
      onValueChange={(item) => {
        if (item === null) {
          return
        }
        if (item.creatable !== undefined) {
          setModalData({ type: 'chain-create', name: item.creatable })
          return
        }
        if (item.id !== restaurant.chain?.id) {
          mutate({ restaurantId: restaurant.id, chainId: item.id })
        }
      }}
    >
      <ComboboxInput placeholder="Pick a chain, or type a name to create one" disabled={isPending} className="w-full max-w-md" />
      <ComboboxContent>
        <ComboboxEmpty>No chains yet. Type a name to create one.</ComboboxEmpty>
        <ComboboxList>
          {(item: ChainItem) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
