import { z } from 'zod'

const optionsSchema = z.object({
  text: z.string().min(1),
})

export async function actionExample(opts: object): Promise<void> {
  const { text } = optionsSchema.parse(opts)
  console.warn(text)
}
