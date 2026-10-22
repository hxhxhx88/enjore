# Contribution guide

`CLAUDE.md` is the short-form engineering overview — repo shape, commands, source-of-truth pointers, dependency boundaries, coding conventions. It is written to be readable by both humans and Claude Code. The `docs/` tree is the long-form source of truth.

## Docs map

- `docs/philosophy/` — principles for design and decision-making.
- `docs/development/` — development instructions and best practices.
- `docs/implementation/` — technical specifications and architectural design.
- `docs/product/` — product specifications.
- `docs/deployment/` — deployment guides and infrastructure.

## Workflow

- Add a feature spec in `docs/product` for new features.
- Add a technical plan in `docs/implementation` for non-trivial ones.
- Run `task check` regularly during development and `task build` before opening a PR.
- A pre-commit hook (installed by `pnpm install`) fixes lint and formatting issues on staged files.

## Environment variables

- Use `.env.example` as the template for `.env.local`. Keep comments on their own lines; a trailing comment after an empty value is read as the value.
- Every variable the admin lists in `apps/admin-next/src/lib/env.ts` is mandatory, `RUNNER_SECRET_CLAUDE` included: the admin does not start while one is missing. A new integration adds its variables there, to `.env.example` and `turbo.json`; see `docs/development/0000-overview/config-env.md`.
