import type { JSX } from 'react'
import { DetailAwardProvider, HeaderAward, SectionEditions, SectionTiers, selectAwardDetail } from '@/components/detail-award'
import { connectDatabase } from '@/lib/db'

export default async function Page({ params }: PageProps<'/awards/[id]'>): Promise<JSX.Element> {
  const { id } = await params
  const db = await connectDatabase()

  const [award, accoladeCount] = await Promise.all([
    db.award.findUniqueOrThrow({ where: { id }, select: selectAwardDetail }),
    db.accolade.count({ where: { awardId: id } }),
  ])

  return (
    <DetailAwardProvider award={award} accoladeCount={accoladeCount}>
      <div className="flex flex-col gap-8">
        <HeaderAward />
        <SectionTiers />
        <SectionEditions />
      </div>
    </DetailAwardProvider>
  )
}
