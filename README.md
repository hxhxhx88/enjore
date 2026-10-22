# Enjore

The admin, the agent pipeline and the public apps of Enjore, a curated guide to notable restaurants in Hong Kong; see `docs/product/0000-project-overview.md` for what it is and `docs/implementation/admin/index.md` for where the build stands. The repository started from a starter template, and one template step is still open:

- Replace the placeholder logos in `packages/ui-web/src/app-logo.tsx` and `packages/email/src/components/email-logo.tsx`.

## Prerequisites

### Development tools

- Install [Task](https://taskfile.dev/docs/installation).
- Install [Node.js](https://nodejs.org/en/download) matching `.nvmrc` (for example with `nvm use`).
- Install [pnpm](https://pnpm.io/installation). The version is pinned in `package.json` (`packageManager`), so any recent pnpm switches to it automatically.
- Install [Docker](https://docs.docker.com/get-docker/) if you want the local PostgreSQL from `compose.yaml`.
- Install [Bun](https://bun.sh/) for the commands in `apps/cli-bun`, run with `task cli -- <command>`.

### Service providers

- Set up a [Postmark](https://postmarkapp.com/) account for email service.
- Set up a [Neon](https://neon.tech/) project for the database.
- Set up a [Vercel](https://vercel.com/) project per Next.js app, as `docs/deployment/0003-nextjs-app.md` describes.
- A claude.ai account on a plan with custom connectors, to connect Claude to the admin's tool endpoint as `docs/deployment/0004-claude-connector.md` describes.

## Quick start

### Preparation

- Run `cp .env.example .env.local` and fill in environment variables.
- Run `task db:up` to start a local PostgreSQL (or point `DATABASE_URL` at your own database).
- Run `task pnpm -- install` to install dependencies.
- Run `task db:dev` and `task db:gen` to initialize the database, then `task cli -- seed-awards` to seed the launch awards.
- Set `DEV_VERIFICATION_PRIVATE_CODE` in `.env.local` to a six-digit code to sign in locally without sending emails.
- Set `RUNNER_SECRET_CLAUDE` in `.env.local` to any value, for example from `openssl rand -base64 32`; the admin does not start without it.

### Start development servers

- Run `task dev` to start development servers.

### Quality gate

- Run `task check` for type checks, tests, lint, unused-code detection and consistency checks.
- Run `task fix` to apply lint and formatting fixes.
- Run `task build` before opening a pull request.

## Next steps

Check `CONTRIBUTING.md` for further details.
