# Next.js server actions

## General principles

- Prefer server actions to route handlers due to their type safety.
- Always use server actions for internal communication between the frontend and backend.
- Prefer using server actions in place, namely next to the UI component, with the filename `action-*.ts` and `'use server'` at the top.
- When there is a strong argument to share a server action, put it in a common place like `src/actions`.
  - Even if two server actions from two different client components happen to be identical at the moment, try to treat it as a coincidence, unless there is a strong logical argument for it.
- Typically use `useMutation` from `@tanstack/react-query` alongside a server action call.
- Return `{ type: 'ok', ... } | { type: 'bad', message }` for user-correctable failures and let internal errors throw (see `runtime-error-handling.md`). Messages come from `i18n._(msg`...`)` with the instance from `getRequestI18n()` (see `i18n.md`).
- Validate the input again on the server with Zod; it arrives from the network.
- Navigate from the client after a successful mutation (`router.replace`) instead of calling `redirect()` inside an action that `useMutation` calls.

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

- `apps/admin-next/src/app/api/mcp/route.ts` is the admin's only route handler. MCP clients speak JSON-RPC over HTTP and cannot call server actions, so the agents' tool endpoint is a route handler. It sits outside Basic Auth because the proxy matcher skips `/api`, and authenticates every request with a bearer secret per runner in `src/lib/mcp/auth.ts`. Record any further route handler here.
