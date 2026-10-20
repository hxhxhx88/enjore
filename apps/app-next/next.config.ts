import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mac-cn'],
  typedRoutes: true,
  turbopack: {
    rules: {
      '*.po': { loaders: ['@lingui/loader'], as: '*.js' },
    },
  },
  experimental: {
    // Lingui macros are compiled by the SWC plugin. The plugin must be built against the SWC runner shipped by the
    // installed Next.js version, which is why both are pinned to exact versions (see lingui/swc-plugin#253).
    // The React Compiler stays off here: Next.js cannot order it after the Lingui plugin, so macros may break.
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
}

export default nextConfig
