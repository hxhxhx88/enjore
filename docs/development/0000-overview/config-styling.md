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

- Sizes derive from the `--app-size` CSS variable instead of `rem`; `task check` rejects `rem` units in `packages/ui-web/src/primitives`. An app may override `--app-size` in its `base.css`, as the admin does.
- Class names are merged with `cn` from the `cn` package (re-exported by `@repo/ui-web/lib/utils`).
- Enabled buttons show the pointer cursor (the shadcn `--pointer` option) through a base-layer rule in `global.css`.
- Base UI popups are portaled to the body: `global.css` positions the body, and every root layout wraps the app in an `isolate` container so popups stack above it.
- Dark mode uses the `dark` class on `<html>`, applied by the `ThemeProvider` from `@repo/ui-web/theme-provider` (stored preference plus system setting). Each app injects the bootstrap script from `@repo/ui-web/lib/theme` with `useServerInsertedHTML` (its `ScriptTheme` component) so the class is set before hydration without React rendering a `<script>`; root layouts set `suppressHydrationWarning` on `<html>` and can mount `@repo/ui-web/theme-toggle`.

## Design language

- Palette: warm neutrals and one accent. Light mode is ink on ivory, dark mode is ivory on charcoal, and the primary is brass in both (bronze on ivory, champagne gold on charcoal). Oxblood is reserved for destructive actions, the chart tokens form a brass-to-charcoal ramp, and the sidebar tokens are the same neutrals one step off the page. The values live in `global.css` and are mirrored in `colors.ts` for the viewport `themeColor`, the web manifest and the emails, so `background` and `primary` stay opaque.
- No corner radius: every `--radius-*` token is `0px`, so the `rounded-*` utilities render square. Primitives keep their stock `rounded-*` classes; what has to go on install is any radius that bypasses the tokens, such as `rounded-full` or `rounded-[4px]`, and `task check` rejects those in `packages/ui-web/src/primitives`.
- Flat static surfaces: `--shadow-2xs`, `--shadow-xs` and `--shadow-sm` are transparent, so cards, inputs, buttons and switches show a hairline border and no shadow while focus rings keep composing. Elevation belongs to floating layers only: popups use `shadow-md`; submenus, sheets and toasts use `shadow-lg`.
- Typography: Geist Sans and Geist Mono, loaded by each app with `next/font` into `--font-geist-sans` and `--font-geist-mono`, followed by the Simplified Chinese system faces (PingFang SC, Hiragino Sans GB, Microsoft YaHei) so Chinese text renders in a platform face rather than the browser's default fallback.
- Scale: `--app-size` is the single size unit, 18px for the public surfaces, and `body` is `text-base`, so unstyled text follows the scale. The admin overrides both in `apps/admin-next/src/styles/base.css` (`--app-size: 15px`, `body` at `text-sm`) to show more on screen.
- Theme: light and dark through the `dark` class on `<html>`; the default follows the system setting.
