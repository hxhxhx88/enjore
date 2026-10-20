# Environment variables configuration

All environment variables are defined in `.env.example`. Before running `task dev`, copy it to `.env.local` and fill in the values.

For packages requring any environment variables, define a `lib/env.ts`, and use `@t3-oss/env-*` to manage environment variables.

- Use `@t3-oss/env-nextjs` for next.js packages and `@t3-oss/env-core` for others.
- Define the variable as mandatory if it is required, otherwise optional.

## Add new environment variables

To add new environment variables:

- Define them in `.env.example`. Group them under a new section for better maintainability if appropriate.
  ```text
  # -----------------------------------------------------------------------------
  # Scope
  # -----------------------------------------------------------------------------
  SCOPE_VAR_1=
  SCOPE_VAR_2=
  ```
- Add them to the `globalEnv` field in `turbo.json` for development visibility.
- Set their values in `.env.local`.
- Register them in the relevant `lib/env.ts` file.
