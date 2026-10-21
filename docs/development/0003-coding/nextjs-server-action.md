# Next.js server actions

## General principles

- Prefer server actions to route handlers due to their type safety.
- Always use server actions for internal communication between the frontend and backend.
- Prefer using server actions in place, namely next to the UI component, with the filename `action-*.ts` and `'use server'` at the top.
- When there is a strong argument to share a server action, put it in a common place like `src/actions`, as `apps/admin-next/src/actions/action-edition-update.ts` does for the edit that both the award page and the edition page offer.
  - Even if two server actions from two different client components happen to be identical at the moment, try to treat it as a coincidence, unless there is a strong logical argument for it.
- Typically use `useMutation` from `@tanstack/react-query` alongside a server action call.
- Return `{ type: 'ok', ... } | { type: 'bad', message }` for user-correctable failures and let internal errors throw (see `runtime-error-handling.md`). In `apps/app-next`, messages come from `i18n._(msg`...`)` with the instance from `getRequestI18n()` (see `i18n.md`). `apps/admin-next` is exempt from i18n and returns plain English messages; `src/lib/action-output.ts` holds its `ActionOutput` type and the `invalidInput` result for a failed re-validation.
- Validate the input again on the server with Zod; it arrives from the network.
- Navigate from the client after a successful mutation instead of calling `redirect()` inside an action that `useMutation` calls: `router.push` to a record the action created, `router.replace` away from a record it deleted or after signing in.

## File structure

A typical client component with server actions looks like:

```text
my-component/
├── action-*.ts    # a server action
├── button-*.tsx   # a button calling that action
└── ...
```

## Examples

See `examples/web/src/server-action` for detailed examples and explanations.

## Workflow

- Define the server-side file `action-*.ts` and implement the server action.
- Define the client-side component `[component]-*.tsx` and implement the UI logic.
- Use `useMutation` to wrap the server action call in the client component.

## Exceptions

- `apps/admin-next/src/app/api/mcp/route.ts` is the admin's only route handler. MCP clients speak JSON-RPC over HTTP and cannot call server actions, so the agents' tool endpoint is a route handler. It sits outside Basic Auth because the proxy matcher skips `/api`, and authenticates every request with a bearer secret per runner in `src/lib/mcp/auth.ts`. Every client reaches it through the claude.ai custom connector, which sends `Authorization: Bearer <RUNNER_SECRET_CLAUDE>`: claude.ai chats, scheduled tasks and Claude Code sessions alike (`docs/deployment/0004-claude-connector.md`). It accepts `POST` only, with a `maxDuration` of 60 seconds, and `src/lib/mcp/server.ts` serves it statelessly on `@modelcontextprotocol/server`, one JSON response per request. Record any further route handler here.
