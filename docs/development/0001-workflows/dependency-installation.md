# Dependency installation

## Web UI primitive

To install a web UI primitive, run:

```bash
task ui:web -- [name]
```

where `name` is the name of a [shadcn component](https://ui.shadcn.com/docs/components). The task uses the shadcn CLI version pinned in `packages/ui-web`, so the generated code matches the installed registry style (`base-vega`, Base UI primitives). After installing, replace any `rem` unit with `--app-size` math; `task check` rejects `rem` in primitives. Also remove any radius that bypasses the tokens, such as `rounded-full` or `rounded-[4px]`: the design language is square, and `task check` rejects those too. Shadows need no edit; the theme neutralizes `shadow-xs` and `shadow-sm`.

## General installation

To install a dependency for a specific package, run:

```bash
pnpm --filter [package] add [dependency]
```

## Version catalog

- Every dependency version lives in the `catalog:` section of `pnpm-workspace.yaml`; manifests reference it with `"catalog:"`. Lint enforces this and `task fix` moves plain specifiers into the catalog.
- `pnpm update` therefore edits the catalog entry, not each `package.json`.

## Supply-chain policies

- pnpm refuses versions published less than a day ago (`minimumReleaseAge`); ranges resolve to the previous version until then.
- `trustPolicy: no-downgrade` rejects versions whose publishing trust dropped compared to earlier releases. Legitimate exceptions go into `trustPolicyExclude` with a comment.
- Dependencies with install scripts must be listed in `allowBuilds` (`pnpm approve-builds` prints the candidates); unlisted scripts fail the install.
