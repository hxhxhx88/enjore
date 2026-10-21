# Next.js app

All Next.js apps will be deployed on [Vercel](https://vercel.com/). Each `*-next` folder in `apps` will have a corresponding project in Vercel.

- Create a new project in Vercel.
- Link the project to the GitHub repository.
- Specify the "Root Directory" as `apps/*-next`.
- Set the Node.js version to the major pinned in `.nvmrc` (Vercel also reads `engines.node` from the root `package.json`).
- Add the environment variable `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel installs the pnpm version pinned in `packageManager`.
  - Without it, Vercel infers pnpm from the lockfile and only maps to pnpm 10 or older, which cannot read this lockfile.
- Add every variable defined in the app's `src/lib/env.ts` and in the env module of each `@repo/*` package it depends on, such as `packages/db/src/lib/env.ts` and `packages/email/src/lib/env.tsx`. Leave the `DEV_*` variables unset in production.
  - `apps/admin-next`: `DATABASE_URL`, `ADMIN_BASIC_AUTH_USERNAME`, `ADMIN_BASIC_AUTH_PASSWORD` and `RUNNER_SECRET_CLAUDE`, whose setup is in `docs/deployment/0004-claude-connector.md`. The admin does not start while one is missing.
  - `apps/app-next`: `APP_ORIGIN`, `DATABASE_URL`, `SESSION_TTL_DAYS` (optional, 30 by default) and the email variables in `docs/deployment/0002-email-service.md`.
  - **Use the pooling connection string** for `DATABASE_URL`.
- Confirm deployment.
- After a short wait, a functional deployment of `*-next` will be online.
- Check the first build log: it must print the pinned pnpm version and Node.js major.

## After the first deployment of the admin

- Apply the migrations and seed the awards, as `docs/deployment/0001-database.md` describes.
- Connect Claude to the tool endpoint, as `docs/deployment/0004-claude-connector.md` describes.
