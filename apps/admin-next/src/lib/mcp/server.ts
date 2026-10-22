import type { JobTool } from '@repo/lib/schemas/job-tool'
import type { Runner } from '@repo/lib/schemas/runner'
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server'
import { jobKindSchema } from '@repo/lib/schemas/job-kind'
import { z } from 'zod'

// The tool names are fixed in `packages/lib/src/schemas/job-tool.ts`; milestone 0005 turns this into a registry typed
// over every tool. Until then the endpoint offers `claim-job` alone, over an empty queue.
const claimJob: JobTool = 'claim-job'

// The factory runs once per request, so nothing is shared between requests and nothing survives a Vercel invocation.
const handler = createMcpHandler(() => {
  const server = new McpServer(
    { name: 'enjore-admin', version: '0.0.0' },
    {
      instructions: 'Tool endpoint of the Enjore admin. Call claim-job to receive work; { "job": null } means the queue is empty and the run is over.',
    },
  )

  server.registerTool(
    claimJob,
    {
      title: 'Claim job',
      description: 'Claims the next queued job for this runner and returns it with its instructions, or { "job": null } when the queue is empty.',
      // Accepted and ignored until the queue exists.
      inputSchema: z.object({ kinds: z.array(jobKindSchema).optional() }),
    },
    async () => ({ content: [{ type: 'text', text: JSON.stringify({ job: null }) }] }),
  )

  return server
}, {
  // One JSON body per request: nothing streams on a serverless function.
  responseMode: 'json',
  // Refuses the long-lived listen stream Claude Code's runtime opens for list changes, which would hold a function open.
  maxSubscriptions: 0,
})

// Serves one request whose bearer secret the route has already verified; the handler never reads credentials itself.
export async function handleMcpRequest(request: Request, runner: Runner, token: string): Promise<Response> {
  return handler.fetch(request, { authInfo: { token, clientId: runner, scopes: [] } })
}
