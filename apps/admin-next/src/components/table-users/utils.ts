import type { Prisma } from '@repo/db'

export const select = {
  id: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export type Row = Prisma.UserGetPayload<{ select: typeof select }>
