# Database workflow

For local development, start the PostgreSQL container from `compose.yaml` with `task db:up` (and stop it with `task db:down`), or point `DATABASE_URL` at another development database.

When you need to modify the database structure, follow these steps:

- Update `packages/db/prisma/schema.prisma`.
- Run `task db:dev` to automatically generate a migration file.
- If the migration requires manual intervention (for example, running custom SQL for backward compatibility):
  - Run `task db:new -- --name <name>` first,
  - Edit the generated migration file,
  - Run `task db:dev` to apply the changes.
- Finally, run `task db:gen` to generate the updated database client.
- If the change adds a unique key that user input can violate, or a `Restrict` foreign key, add its message to `uniqueKeys` or `restrictedForeignKeys` in `apps/admin-next/src/lib/db-error.ts`.
- Run `task db:status` to see which migrations a database has applied.
- Run `task cli -- seed-awards` to create or update the launch awards, their tiers and the translations of their names in the database of `.env.local`. It is idempotent and leaves `isActive` to the operator.
