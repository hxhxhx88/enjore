import type { JSX } from 'react'
import { DetailEditionProvider, HeaderEdition, selectEditionDetail } from '@/components/detail-edition'
import { connectDatabase } from '@/lib/db'

// Milestone 0003 appends the counts, the accolade table and the unresolved entries; 0005 the import actions.
export default async function Page({ params }: PageProps<'/awards/[id]/editions/[edition-id]'>): Promise<JSX.Element> {
  const { id, 'edition-id': editionId } = await params
  const db = await connectDatabase()

  // The award id in the URL scopes the lookup, so an edition is only reachable under its own award.
  const edition = await db.awardEdition.findUniqueOrThrow({
    where: { id: editionId, awardId: id },
    select: selectEditionDetail,
  })

  return (
    <DetailEditionProvider edition={edition}>
      <div className="flex flex-col gap-8">
        <HeaderEdition />
      </div>
    </DetailEditionProvider>
  )
}
