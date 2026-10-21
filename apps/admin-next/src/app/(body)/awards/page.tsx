import type { Prisma } from '@repo/db'
import type { JSX } from 'react'
import { Suspense } from 'react'
import { FilterSearch } from '@/components/filter-search'
import { FilterSelect } from '@/components/filter-select'
import { Pagination } from '@/components/pagination'
import { select, TableAwards } from '@/components/table-awards'
import { connectDatabase } from '@/lib/db'
import { ButtonAwardAdd } from './button-award-add'
import { activeFilterOptions, pageSize, searchParametersSchema } from './search-parameters'

export default async function Page({ searchParams }: PageProps<'/awards'>): Promise<JSX.Element> {
  const { page, active, q } = searchParametersSchema.parse(await searchParams)
  const db = await connectDatabase()

  // Conditional spreads keep `undefined` out of the optional keys.
  const where: Prisma.AwardWhereInput = {
    ...(active === undefined ? {} : { isActive: active === 'true' }),
    ...(q === ''
      ? {}
      : {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { shortName: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ],
        }),
  }

  const [rows, total] = await Promise.all([
    db.award.findMany({
      where,
      select,
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.award.count({ where }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* The filters read `useSearchParams`, which needs a Suspense boundary. */}
        <Suspense>
          <FilterSearch name="q" value={q} placeholder="Search awards" className="w-64" />
          <FilterSelect name="active" value={active} options={activeFilterOptions} allLabel="All awards" />
        </Suspense>
        <div className="ml-auto">
          <ButtonAwardAdd />
        </div>
      </div>
      <TableAwards rows={rows} className="flex-1" />
      <div className="flex justify-end">
        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  )
}
