import { defineConfig } from 'vitest/config'

// Each package that has tests carries its own `vitest.config.ts` and is registered here.
export default defineConfig({
  test: {
    projects: ['apps/admin-next', 'apps/app-next', 'packages/i18n', 'packages/lib'],
  },
})
