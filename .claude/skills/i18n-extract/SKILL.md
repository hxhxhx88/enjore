---
name: i18n-extract
description: Use when adding user-facing strings wrapped in Lingui t/<Trans> macros, or when fixing missing translations that block task build.
---

# I18n extract

## Procedure

- Read `docs/development/0001-workflows/i18n.md` and `docs/development/0003-coding/i18n.md`.
- Confirm the strings are on user-facing surfaces (public web). `apps/admin-next` is exempt — do not wrap admin strings.
- In components, prefer `<Trans>` from `@lingui/react/macro`. Use `useLingui()`'s `t` only when `<Trans>` cannot express the text.
- Outside JSX, describe the text with `msg` from `@lingui/core/macro` and translate it with `i18n._(...)` on the instance from `setupI18n` (server components) or `getRequestI18n()` (server actions, `@/lib/i18n`). `t(i18n)` is deprecated and rejected by lint. Never activate a locale on the global instance.
- Run `task i18n` to extract into `packages/i18n/locales/*/messages.po`.
- Complete every empty `msgstr ""` in every locale. `task check` enforces completeness and `task build` will fail otherwise.
