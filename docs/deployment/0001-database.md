# Database

The project uses PostgreSQL as its database. In production, we use [Neon](https://neon.tech).

To get started, create a project in Neon, and grab the connection string for `DATABASE_URL`.

- Use the **pooling connection string** (e.g. `...-pooler...`) for serverless backends like the apps on Vercel.
- Use the **direct connection string** for development and maintenance (e.g. updating schema and dumping data).

## Local development

- `compose.yaml` defines a local PostgreSQL service. Start it with `task db:up` and stop it with `task db:down`.
- The default `DATABASE_URL` in `.env.example` points at this service.

## Migration

Apply pending migrations to a remote database in either of these ways:

- Run the workflow in `.github/workflows/migrate-database.yaml` through GitHub Actions.
  - It runs `task db:deploy` (`prisma migrate deploy`), which only applies committed migrations and never creates or resets anything.
  - Create a GitHub environment (for example `production`) with a `DATABASE_URL` secret holding the direct connection string, then pick that environment when dispatching the workflow.
- Set `DATABASE_URL` to the remote direct connection string and run `task db:deploy` locally.

Reserve `task db:dev` (`prisma migrate dev`) for local development databases: it creates migrations from schema changes and may reset the database.

## Seed data

- `task cli -- seed-awards` creates or updates the awards the product launches with, their tiers and the translations of their names (`apps/cli-bun/src/actions/seed-awards/`). Run it once the migrations are applied.
- `task` loads `.env.local`, so by default the command writes to the local database. To seed a remote database, export `DATABASE_URL` with its direct connection string first; a variable set in the shell wins over `.env.local`.
- It can run again at any time: awards are matched by slug and tiers by award and name. A re-run restores every seeded field except whether an award is active, so an operator's edit to a seeded field is undone; tiers the operator added are left alone.
