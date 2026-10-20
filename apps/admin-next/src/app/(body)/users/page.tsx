import type { Prisma } from '@repo/db'
import type { JSX } from 'react'
import { Suspense } from 'react'
import z from 'zod'
import { Pagination } from '@/components/pagination'
import { TableUsers } from '@/components/table-users'
import { select } from '@/components/table-users/utils'
import { connectDatabase } from '@/lib/db'
import { ButtonUserAdd } from './button-add'

const searchParametersSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
})

const pageSize = 50

export default async function Page({ searchParams }: PageProps<'/users'>): Promise<JSX.Element> {
  const { page } = searchParametersSchema.parse(await searchParams)
  const db = await connectDatabase()

  const where: Prisma.UserWhereInput = {}
  const [rows, total] = await Promise.all([
    db.user.findMany({
      where,
      select,
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.user.count({ where }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="h-full flex flex-col gap-2">
      <div>
        <ButtonUserAdd />
      </div>
      <TableUsers rows={rows} className="flex-1" />
      <div className="flex justify-end">
        {/* The pagination links read `useSearchParams`, which needs a Suspense boundary. */}
        <Suspense>
          <Pagination currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  )
}
