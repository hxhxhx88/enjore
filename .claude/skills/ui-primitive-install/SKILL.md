---
name: ui-primitive-install
description: Use when installing a new shadcn UI primitive into the shared web UI package.
---

# UI primitive install

## Procedure

- Read `docs/development/0001-workflows/dependency-installation.md`.
- Run `task ui:web -- <name>` where `<name>` is a shadcn component id. Destination: `packages/ui-web/src/primitives/`. The task uses the pinned shadcn CLI and the `base-vega` style (Base UI primitives).
- After install, open the generated file and replace any `rem` units (for example `1.5rem`) with `--app-size` math such as `calc(1.5 * var(--app-size))`. `task check` greps for `[[:digit:]]rem` in primitives and fails otherwise.
- Consumers import primitives through subpaths, for example `@repo/ui-web/primitives/<name>`; the package has no `index.ts`.
- Compose custom elements with the `render` prop (Base UI), never `asChild`.
- Verify with `task check` before handing back.
