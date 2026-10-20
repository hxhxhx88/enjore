'use server'

import type { FormTypeUserEdit } from '@/components/form-user-edit'
import { revalidatePath } from 'next/cache'
import { connectDatabase, parseDatabaseError } from '@/lib/db'
import { routes } from '@/lib/routes'

interface Input {
  userId: string
  formData: FormTypeUserEdit
}

interface OutputBad {
  type: 'bad'
  message: string
}

interface OutputOk {
  type: 'ok'
}

type Output = OutputOk | OutputBad

export async function actionEditUser(input: Input): Promise<Output> {
  const { userId, formData: { email } } = input
  const db = await connectDatabase()

  try {
    await db.user.update({
      where: { id: userId },
      data: { email },
    })
    revalidatePath(routes.users.list)
    revalidatePath(routes.users.detail(userId))
    return { type: 'ok' }
  }
  catch (e) {
    const error = parseDatabaseError(e)
    if (error) {
      return { type: 'bad', message: error.message }
    }
    throw e
  }
}
