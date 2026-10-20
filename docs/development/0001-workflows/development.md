# Development workflow

- Run `task check` regularly to ensure that formatting, linting, type checks, tests and consistency checks all pass.
  - It runs type generation and type checking, unit tests, i18n extraction and completeness, the `rem` guard for UI primitives, the theme colors sync check, lint (without fixing) and knip (unused files, exports and dependencies).
  - Lint runs with `--max-warnings 0`, so a warning fails the gate like an error. The typescript-eslint type-aware rules are on (every TypeScript file must belong to a tsconfig project; the root `tsconfig.json` covers the files outside the workspaces), jsx-a11y checks the markup, and the dependency boundaries of `structure-topology.md` are enforced.
- Run `task fix` to apply lint and formatting fixes. A pre-commit hook (installed by `pnpm install`) runs the same fixes on staged files.
- Run `task test` to run unit tests alone. Tests live next to the code as `*.test.ts` and run with Vitest; packages with tests register a `vitest.config.ts` and are listed in the root `vitest.config.ts`.
- Before committing your final changes, run `task build` to confirm everything compiles successfully.
  - This will run the checks first and fail if any issues are detected.
