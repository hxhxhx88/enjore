import { env } from '@/lib/env'
import { authenticateRunner } from '@/lib/mcp/auth'
import { handleMcpRequest } from '@/lib/mcp/server'

// The admin's only route handler: MCP clients speak JSON-RPC over HTTP and cannot call server actions. The clients are
// claude.ai's connector runtime and Claude Code. The proxy matcher skips `/api`, so this route is outside Basic Auth and
// checks the bearer secret itself. See the exception in `docs/development/0003-coding/nextjs-server-action.md`. Only
// `POST` exists; Next answers other methods with 405.
export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  const authorization = request.headers.get('authorization')
  const runner = authenticateRunner(authorization, { claude: env.RUNNER_SECRET_CLAUDE })
  if (runner === undefined) {
    return new Response('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } })
  }

  // A runner only matches when the header is `Bearer <token>`, so the token is the second part.
  const token = authorization?.split(' ')[1] ?? ''
  return handleMcpRequest(request, runner, token)
}
