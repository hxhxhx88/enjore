'use client'

import type { JSX } from 'react'
import { LoadingButton } from '@repo/ui-web/loading-button'
import { Button } from '@repo/ui-web/primitives/button'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { EditorTranslations } from '@/components/editor-translations'
import { actionChainNameSwap } from './action-chain-name-swap'
import { actionRestaurantChainSet } from './action-restaurant-chain-set'
import { useProps, useStore } from './context'
import { PickerChain } from './picker-chain'

// The brand the venue belongs to, when it does. Chains have no page of their own: their names and translations are
// edited from any of their branches.
export function SectionChain(): JSX.Element {
  const { restaurant, chainNameTranslations } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const { chain } = restaurant

  const remove = useMutation({
    mutationFn: actionRestaurantChainSet,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({ type: 'success', title: 'Removed from the chain.' })
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
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">Chain</h2>
      <p className="text-sm text-muted-foreground">
        Branches of a chain are distinct venues with their own records; the resolver never proposes them as duplicates
        of each other.
      </p>
      <PickerChain />
      {chain !== null && (
        <div className="flex flex-col gap-3 border p-4">
          <DescriptionList>
            <DescriptionItem term="Name">
              {chain.name}
              <span className="ml-2 text-xs text-muted-foreground">{chain.nameLocale}</span>
            </DescriptionItem>
            <DescriptionItem term="Slug">
              <code className="font-mono text-xs">{chain.slug}</code>
            </DescriptionItem>
            <DescriptionItem term="Branches">{chain._count.restaurants}</DescriptionItem>
          </DescriptionList>
          <EditorTranslations
            table="chains"
            recordId={chain.id}
            field="name"
            canonical={{ value: chain.name, locale: chain.nameLocale }}
            rows={chainNameTranslations}
            onMakeCanonical={async locale => actionChainNameSwap({ chainId: chain.id, locale })}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModalData({ type: 'chain-edit', chain })}>
              Edit chain
            </Button>
            <LoadingButton
              variant="ghost"
              isLoading={remove.isPending}
              onClick={() => remove.mutate({ restaurantId: restaurant.id, chainId: null })}
            >
              Remove from chain
            </LoadingButton>
          </div>
        </div>
      )}
    </section>
  )
}
