import type { NextRequest } from 'next/server'
import { Buffer } from 'node:buffer'
import { NextResponse } from 'next/server'
import { secureEquals } from '@/lib/crypto'
import { env } from '@/lib/env'

export function proxy(request: NextRequest): NextResponse {
  const authHeader = request.headers.get('authorization')
  const [scheme, encoded] = authHeader?.split(' ') ?? []

  if (scheme?.toLowerCase() === 'basic' && encoded !== undefined && encoded !== '') {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    // Passwords may contain ":" so only the first one separates the user name.
    const separator = decoded.indexOf(':')
    const user = separator === -1 ? decoded : decoded.slice(0, separator)
    const pass = separator === -1 ? '' : decoded.slice(separator + 1)

    const userMatches = secureEquals(user, env.ADMIN_BASIC_AUTH_USERNAME)
    const passMatches = secureEquals(pass, env.ADMIN_BASIC_AUTH_PASSWORD)
    if (userMatches && passMatches) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      // This header triggers the browser's built-in login pop-up
      'WWW-Authenticate': 'Basic realm="Restricted Area", charset="UTF-8"',
    },
  })
}

export const config = {
  matcher: ['/((?!api|public|_next|_vercel|.*\\..*).*)'],
}
