'use server'

import type { Prisma } from '@repo/db'
import { connectDatabase } from '@/lib/db'

interface Input {
  userId: string
}

const select = {
  email: true,
} satisfies Prisma.UserSelect

export type ReadUserOutput = Prisma.UserGetPayload<{ select: typeof select }>

export async function actionReadUser(input: Input): Promise<ReadUserOutput> {
  const { userId } = input
  const db = await connectDatabase()
  return db.user.findUniqueOrThrow({
    where: { id: userId },
    select,
  })
}
