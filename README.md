# Starter template

This is a starter template project. Take the following steps to adapt it to your own project.

- Search for `Starter Template` globally in the codebase and replace it with your project name.
- Replace the placeholder logos in `packages/ui-web/src/app-logo.tsx` and `packages/email/src/components/email-logo.tsx`.
- Adjust the theme tokens in `configs/ui/global.css` and mirror them in `configs/ui/colors.ts` (`task check` verifies they match).

> Once you have completed the initial setup, you may remove the documentation above this point.

## Prerequisites

### Development tools

- Install [Task](https://taskfile.dev/docs/installation).
- Install [Node.js](https://nodejs.org/en/download) matching `.nvmrc` (for example with `nvm use`).
- Install [pnpm](https://pnpm.io/installation). The version is pinned in `package.json` (`packageManager`), so any recent pnpm switches to it automatically.
- Install [Docker](https://docs.docker.com/get-docker/) if you want the local PostgreSQL from `compose.yaml`.

### Service providers

- Set up a [Postmark](https://postmarkapp.com/) account for email service.
- Set up a [Neon](https://neon.tech/) project for the database.
- Set up a [Vercel](https://vercel.com/) project for delivering servers.

## Quick start

### Preparation

- Run `cp .env.example .env.local` and fill in environment variables.
- Run `task db:up` to start a local PostgreSQL (or point `DATABASE_URL` at your own database).
- Run `task pnpm -- install` to install dependencies.
- Run `task db:dev` and `task db:gen` to initialize the database.
- Set `DEV_VERIFICATION_PRIVATE_CODE` in `.env.local` to a six-digit code to sign in locally without sending emails.

### Start development servers

- Run `task dev` to start development servers.

### Quality gate

- Run `task check` for type checks, tests, lint, unused-code detection and consistency checks.
- Run `task fix` to apply lint and formatting fixes.
- Run `task build` before opening a pull request.

## Next steps

Check `CONTRIBUTING.md` for further details.
