import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['mac-cn'],
  typedRoutes: true,
  // The admin app has no Lingui macros, so the React Compiler can run without plugin-ordering concerns.
  reactCompiler: true,
}

export default nextConfig
