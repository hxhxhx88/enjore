'use server'

import { revalidatePath } from 'next/cache'
import { connectDatabase } from '@/lib/db'
import { routes } from '@/lib/routes'

interface Input {
  userId: string
}

export async function actionDeleteUser(input: Input): Promise<void> {
  const { userId } = input
  const db = await connectDatabase()
  await db.user.delete({
    where: { id: userId },
  })
  revalidatePath(routes.users.list)
}
