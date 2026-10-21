import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

// `task cli -- ...` loads `.env.local`, so the database of the current environment is the one the commands write to.
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
