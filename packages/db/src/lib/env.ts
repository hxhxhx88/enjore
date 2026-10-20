import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
  // Without this, running commands like `prisma generate` not through `task` will fail.
  skipValidation: process.env.NODE_ENV !== 'production',
})
