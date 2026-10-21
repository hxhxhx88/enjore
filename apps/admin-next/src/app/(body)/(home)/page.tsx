import type { Prisma } from '@repo/db'
import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { CardStat } from '@/components/card-stat'
import { connectDatabase } from '@/lib/db'
import { routes } from '@/lib/routes'

// Counts are read on every request: seeds and, later, runners change the data without passing through an action
// that could revalidate a prerendered page.
export const dynamic = 'force-dynamic'

// The dashboard shows the cards whose data exists; each later milestone adds one query and one card.
export default async function Page(): Promise<JSX.Element> {
  const db = await connectDatabase()

  const awaiting: Prisma.AwardEditionWhereInput = { importedAt: { not: null }, verifiedAt: null }
  const [awardCount, activeAwardCount, awaitingCount, awaitingEditions] = await Promise.all([
    db.award.count(),
    db.award.count({ where: { isActive: true } }),
    db.awardEdition.count({ where: awaiting }),
    db.awardEdition.findMany({
      where: awaiting,
      select: { id: true, label: true, awardId: true, award: { select: { name: true } } },
      orderBy: { importedAt: 'asc' },
      take: 5,
    }),
  ])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardStat title="Awards" value={awardCount} description={`${activeAwardCount} active`} href={routes.awards.list} />
      <CardStat title="Editions awaiting verification" value={awaitingCount} description="Imported, not yet verified">
        {awaitingEditions.length === 0
          ? <p className="text-sm text-muted-foreground">Nothing waits for verification.</p>
          : (
              <ul className="flex flex-col gap-1 text-sm">
                {awaitingEditions.map(edition => (
                  <li key={edition.id}>
                    <Button
                      variant="link"
                      nativeButton={false}
                      className="h-auto p-0"
                      render={<Link href={routes.awards.edition(edition.awardId, edition.id)} />}
                    >
                      {`${edition.label} · ${edition.award.name}`}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
      </CardStat>
    </div>
  )
}
