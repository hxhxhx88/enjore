'use server'

import type { FormTypeUserAdd } from '@/components/form-user-add'
import { revalidatePath } from 'next/cache'
import { connectDatabase, parseDatabaseError } from '@/lib/db'
import { routes } from '@/lib/routes'

interface OutputBad {
  type: 'bad'
  message: string
}

interface OutputOk {
  type: 'ok'
  id: string
}

type Output = OutputOk | OutputBad

export async function actionAddUser(formData: FormTypeUserAdd): Promise<Output> {
  const { email } = formData
  const db = await connectDatabase()
  try {
    const { id } = await db.user.create({
      data: { email },
      select: { id: true },
    })
    revalidatePath(routes.users.list)
    return { type: 'ok', id }
  }
  catch (e) {
    const error = parseDatabaseError(e)
    if (error) {
      return { type: 'bad', message: error.message }
    }
    throw e
  }
}
