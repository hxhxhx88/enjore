'use server'

interface Input {
  name: string
  email: string
}

interface Output {
  id: string
}

export async function actionUserAdd(input: Input): Promise<Output> {
  void input
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { id: '1' }
}
