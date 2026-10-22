import type { JSX } from 'react'
import {
  DetailRestaurantProvider,
  HeaderRestaurant,
  SectionBasics,
  SectionChain,
  SectionNames,
  selectChainOption,
  selectRestaurantDetail,
  selectTranslationRow,
} from '@/components/detail-restaurant'
import { connectDatabase } from '@/lib/db'

export default async function Page({ params }: PageProps<'/restaurants/[id]'>): Promise<JSX.Element> {
  const { id } = await params
  const db = await connectDatabase()

  const restaurant = await db.restaurant.findUniqueOrThrow({ where: { id }, select: selectRestaurantDetail })

  // Translation has no relation to its records, so the rows are loaded by their key once the chain is known.
  const [nameTranslations, chainNameTranslations, chains] = await Promise.all([
    db.translation.findMany({
      where: { table: 'restaurants', recordId: id, field: 'name' },
      select: selectTranslationRow,
      orderBy: { locale: 'asc' },
    }),
    restaurant.chain === null
      ? []
      : db.translation.findMany({
          where: { table: 'chains', recordId: restaurant.chain.id, field: 'name' },
          select: selectTranslationRow,
          orderBy: { locale: 'asc' },
        }),
    db.chain.findMany({ select: selectChainOption, orderBy: { name: 'asc' } }),
  ])

  return (
    <DetailRestaurantProvider
      restaurant={restaurant}
      nameTranslations={nameTranslations}
      chainNameTranslations={chainNameTranslations}
      chains={chains}
    >
      <div className="flex flex-col gap-6">
        <HeaderRestaurant />
        <SectionBasics />
        <SectionNames />
        <SectionChain />
      </div>
    </DetailRestaurantProvider>
  )
}
