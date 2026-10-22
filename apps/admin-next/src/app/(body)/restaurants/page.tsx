import type { Prisma } from '@repo/db'
import type { JSX } from 'react'
import { Suspense } from 'react'
import { FilterSearch } from '@/components/filter-search'
import { FilterSelect } from '@/components/filter-select'
import { Pagination } from '@/components/pagination'
import { select, TableRestaurants } from '@/components/table-restaurants'
import { connectDatabase } from '@/lib/db'
import { publicationStateWhere } from '@/lib/derive-publication-state'
import { regionLabel } from '@/lib/labels'
import { staleBasicsCutoff, staleBasicsWhere } from '@/lib/stale-basics'
import { ButtonRestaurantAdd } from './button-restaurant-add'
import {
  pageSize,
  searchParametersSchema,
  staleFilterOptions,
  stateFilterOptions,
  statusFilterOptions,
} from './search-parameters'

export default async function Page({ searchParams }: PageProps<'/restaurants'>): Promise<JSX.Element> {
  const { page, q, region, chain, state, status, stale } = searchParametersSchema.parse(await searchParams)
  const db = await connectDatabase()

  // The search covers the translated names too; Translation has no relation, so their record ids come first.
  const translatedIds = q === ''
    ? []
    : (await db.translation.findMany({
        where: { table: 'restaurants', field: 'name', value: { contains: q, mode: 'insensitive' } },
        select: { recordId: true },
        take: 500,
      })).map(row => row.recordId)

  const clauses: Prisma.RestaurantWhereInput[] = []
  if (region !== undefined) {
    clauses.push({ region })
  }
  if (chain !== undefined) {
    clauses.push({ chainId: chain })
  }
  if (state !== undefined) {
    clauses.push(publicationStateWhere(state))
  }
  if (status !== undefined) {
    clauses.push({ businessStatus: status })
  }
  if (stale !== undefined) {
    clauses.push(staleBasicsWhere(staleBasicsCutoff()))
  }
  if (q !== '') {
    clauses.push({ OR: [{ name: { contains: q, mode: 'insensitive' } }, { id: { in: translatedIds } }] })
  }
  const where: Prisma.RestaurantWhereInput = { AND: clauses }

  const [rows, total, regions, chains] = await Promise.all([
    db.restaurant.findMany({
      where,
      select,
      orderBy: [{ name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.restaurant.count({ where }),
    db.restaurant.findMany({ distinct: ['region'], select: { region: true }, orderBy: { region: 'asc' } }),
    db.chain.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])
  const totalPages = Math.ceil(total / pageSize)
  const regionOptions = regions.map(row => ({ value: row.region, label: regionLabel(row.region) }))
  const chainOptions = chains.map(row => ({ value: row.id, label: row.name }))

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* The filters read `useSearchParams`, which needs a Suspense boundary. */}
        <Suspense>
          <FilterSearch name="q" value={q} placeholder="Search restaurants" className="w-64" />
          <FilterSelect name="region" value={region} options={regionOptions} allLabel="All regions" />
          <FilterSelect name="chain" value={chain} options={chainOptions} allLabel="All chains" />
          <FilterSelect name="state" value={state} options={stateFilterOptions} allLabel="Any state" />
          <FilterSelect name="status" value={status} options={statusFilterOptions} allLabel="Any business status" />
          <FilterSelect name="stale" value={stale} options={staleFilterOptions} allLabel="Fresh or stale" />
        </Suspense>
        <div className="ml-auto">
          <ButtonRestaurantAdd />
        </div>
      </div>
      <TableRestaurants rows={rows} className="flex-1" />
      <div className="flex justify-end">
        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  )
}
