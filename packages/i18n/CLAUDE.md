# I18n package

Lingui message catalogs at `locales/*/messages.po`. English is the source language in code.

## Rules

- `apps/admin-next` is exempt — admin website text stays plain English.
- In components, prefer `<Trans>` from `@lingui/react/macro`. Use `useLingui()`'s `t` only when `<Trans>` cannot express the text (for example, a `title` prop).
- Outside JSX, describe the text with `msg` from `@lingui/core/macro` and translate it with `i18n._(...)` on the instance from `setupI18n` (server components) or `getRequestI18n()` (server actions, `@/lib/i18n` in app-next). `t(i18n)` is deprecated and rejected by lint. Never activate a locale on the global instance. Never return hardcoded English messages to end users.

## Workflow

- Run `task i18n` to extract translatable strings into `locales/*/messages.po`.
- Complete every empty `msgstr ""` in every locale. `task check` enforces completeness and `task build` will fail otherwise.

## Deep reading

- `docs/development/0001-workflows/i18n.md`
- `docs/development/0003-coding/i18n.md`
- `docs/development/0000-overview/config-i18n.md`
