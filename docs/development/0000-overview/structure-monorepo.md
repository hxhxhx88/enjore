# Codebase structure

The project is organized as a **monorepo**. Below is the top-level folder structure.

```text
.
├── apps/                  # Deployable applications (websites, CLI tools, etc.)
│   └── {name}-{runtime}/  # `name` identifies the application; `runtime` specifies the
│                          # delivery target. Use `browser`, `server`, etc. when the
│                          # boundary is clear, or the framework name (e.g. `next`) for
│                          # full-stack frameworks that blur the client/server boundary.
├── packages/              # Non-deliverable internal packages.
│   ├── db/                # Database schemas and migrations — the single source of truth
│   │                      # for the project's data structures.
│   ├── email/             # Email templates and delivery.
│   ├── i18n/              # Centralized i18n configuration, utilities, and translations.
│   ├── lib/               # Shared utilities, and the Zod schemas of external objects and
│   │                      # domain vocabularies (`src/schemas/`).
│   └── ui-web/            # Common web UI primitives and components, including the marks registry.
├── configs/               # Shared configuration files.
│   ├── ts/                # TypeScript-related configuration.
│   └── ui/                # UI-related configuration.
├── examples/              # Example codes for doc and demo purposes. Never use them in reality.
├── tasks/                 # Task definitions for various scopes.
├── taskfile.yaml          # Entry point for all tasks.
├── compose.yaml           # Local PostgreSQL for development (`task db:up`).
├── pnpm-workspace.yaml    # Workspaces, dependency version catalog, supply-chain policies.
├── vitest.config.ts       # Registers the workspaces that have unit tests, apps included.
├── knip.json              # Unused files, exports and dependencies check.
├── renovate.json          # Dependency update rules.
└── ...                    # Other root-level configuration files.
```
