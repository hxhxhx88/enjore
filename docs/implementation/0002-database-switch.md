# Database switch

`connectDatabase()` in the `src/lib/db.ts` of `apps/app-next` and `apps/admin-next` is the only way the web apps reach the database. It returns the Prisma client for `DATABASE_URL` by default, and it is the single place where the database can be selected per request. `apps/cli-bun` serves no requests and calls `newDatabase` with its own `DATABASE_URL`.

## Why it exists

- The e2e methodology of the full template gives every test case its own seeded database and points the running server at it, so one deployment serves every test case.
- This repo has no e2e suite yet. The switch is the scaffolding for it: call sites already go through `connectDatabase()`, so adopting isolated databases later needs no application changes.

## How it works

- With `DEV_ALLOW_DATABASE_SWITCH=true`, a request may carry a `database` cookie that holds a URL-encoded PostgreSQL connection string. `resolveDatabaseUrl` in `packages/lib/src/database-switch.ts` validates it, and `newDatabase` returns the client cached for that URL.
- With the flag off, which is the default, the cookie is never read. Rendering modes and production behavior are unchanged.

## Guards

- The flag is off by default and must never be on in production.
- The host of the requested URL must be listed in `DEV_DATABASE_SWITCH_HOSTS`, a comma-separated list where `*.example.com` matches any subdomain. An empty list allows nothing.
- A request for another host, another protocol or a malformed URL throws. Falling back to the default database would let a misconfigured test run write into it.
- Error messages name the host only; the URL carries credentials.

## Using it from a browser test

- Set the cookie before the first navigation. In Playwright: `context.addCookies([{ name: 'database', value: encodeURIComponent(url), domain: 'localhost', path: '/' }])`.
- Create the target database with the current schema first, for example with `prisma db push` against its URL.
