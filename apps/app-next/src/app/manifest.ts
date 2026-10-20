import type { MetadataRoute } from 'next'
import { colors } from '@repo/ui-config/colors'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Starter Template',
    short_name: 'Starter',
    start_url: '/',
    display: 'standalone',
    background_color: colors.light.background,
    theme_color: colors.light.primary,
  }
}
