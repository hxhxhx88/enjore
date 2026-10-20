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
- Run `task db:status` to see which migrations a database has applied.
