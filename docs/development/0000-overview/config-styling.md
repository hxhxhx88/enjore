# Styling configuration

This codebase uses shadcn as the UI framework, built on Base UI primitives, and shadcn uses Tailwind CSS for styling.

Styling is configured in these layers:

- `apps/*`
- `packages/ui-web`
- `configs/ui`

`configs/ui/global.css` is the single source of truth for styling tokens.

- In some cases, values in `global.css` cannot be referenced directly.
- For those cases, `configs/ui/colors.ts` duplicates the required values.
- `global.css` and `colors.ts` must stay synchronized. `task check` runs `configs/ui/check-colors.ts` and fails when they drift.

`packages/ui-web` references `configs/ui` in its stylesheet file:

- `packages/ui-web/src/styles/global.css`
- It also imports `shadcn/tailwind.css`, which provides the `data-open`/`data-closed` variants and animation utilities the generated primitives rely on. This is why the `shadcn` package is a runtime dependency of `packages/ui-web`.

Finally, `apps/*` reference the `global.css` file exposed by `ui-web`:

- `apps/*/src/styles/base.css`

## Conventions

- Sizes derive from the `--app-size` CSS variable instead of `rem`; `task check` rejects `rem` units in `packages/ui-web/src/primitives`.
- Class names are merged with `cn` from the `cn` package (re-exported by `@repo/ui-web/lib/utils`).
- Enabled buttons show the pointer cursor (the shadcn `--pointer` option) through a base-layer rule in `global.css`.
- Base UI popups are portaled to the body: `global.css` positions the body, and every root layout wraps the app in an `isolate` container so popups stack above it.
- Dark mode uses the `dark` class on `<html>`, applied by the `ThemeProvider` from `@repo/ui-web/theme-provider` (stored preference plus system setting). Each app injects the bootstrap script from `@repo/ui-web/lib/theme` with `useServerInsertedHTML` (its `ScriptTheme` component) so the class is set before hydration without React rendering a `<script>`; root layouts set `suppressHydrationWarning` on `<html>` and can mount `@repo/ui-web/theme-toggle`.
