import { oklchToHsl } from '@repo/lib/colors'
import { colors as themeColors } from '@repo/ui-config/colors'

// Gmail in browser does not support `oklch` colors, so we need to convert them to `hsl`.
export const colors = {
  primary: oklchToHsl(themeColors.dark.primary),
  primaryForeground: oklchToHsl(themeColors.dark['primary-foreground']),
  background: oklchToHsl(themeColors.dark.background),
  foreground: oklchToHsl(themeColors.dark.foreground),
  muted: oklchToHsl(themeColors.dark.muted),
  mutedForeground: oklchToHsl(themeColors.dark['muted-foreground']),
}
