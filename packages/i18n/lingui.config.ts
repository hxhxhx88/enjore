import { defineConfig } from '@lingui/cli'
import { formatter } from '@lingui/format-po'
import { defaultLocale, locales } from './src/locales'

export default defineConfig({
  sourceLocale: defaultLocale,
  locales: [...locales],
  catalogs: [
    {
      path: '<rootDir>/locales/{locale}/messages',
      include: ['<rootDir>/../../apps/*/src/**/*'],
      exclude: ['<rootDir>/../../apps/cli-bun/**'],
    },
  ],
  format: formatter({ origins: false }),
})
