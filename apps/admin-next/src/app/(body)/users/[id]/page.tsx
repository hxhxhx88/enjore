import type { JSX } from 'react'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@repo/ui-web/primitives/item'
import { DetailUserProvider } from '@/components/detail-user'
import { connectDatabase } from '@/lib/db'
import { ButtonUserEdit } from './button-edit'
import { ButtonMenu } from './button-menu'

export default async function Page({ params }: PageProps<'/users/[id]'>): Promise<JSX.Element> {
  const { id } = await params
  const db = await connectDatabase()

  const { email } = await db.user.findUniqueOrThrow({
    where: { id },
    select: { email: true },
  })

  return (
    <DetailUserProvider userId={id}>
      <div className="space-y-4">
        <div className="flex justify-between">
          <ButtonUserEdit />
          <ButtonMenu />
        </div>
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>Email</ItemTitle>
            <ItemDescription>{email}</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </DetailUserProvider>
  )
}
