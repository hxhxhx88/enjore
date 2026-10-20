import type { NextRequest, NextResponse } from 'next/server'
import { i18nMiddleware } from '@/lib/i18n'

export function proxy(request: NextRequest): NextResponse {
  return i18nMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|public|_next|_vercel|.*\\..*).*)'],
}
