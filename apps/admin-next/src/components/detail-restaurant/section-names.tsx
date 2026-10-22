'use client'

import type { JSX } from 'react'
import { EditorTranslations } from '@/components/editor-translations'
import { actionRestaurantNameSwap } from './action-restaurant-name-swap'
import { useProps } from './context'

// The canonical name and the other official names, kept as translations of the name. "Make canonical" swaps one of
// them with the canonical name, for the Cantonese kitchen whose Chinese name should lead.
export function SectionNames(): JSX.Element {
  const { restaurant, nameTranslations } = useProps()

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">Names</h2>
      <EditorTranslations
        table="restaurants"
        recordId={restaurant.id}
        field="name"
        canonical={{ value: restaurant.name, locale: restaurant.nameLocale }}
        rows={nameTranslations}
        onMakeCanonical={async locale => actionRestaurantNameSwap({ restaurantId: restaurant.id, locale })}
      />
    </section>
  )
}
