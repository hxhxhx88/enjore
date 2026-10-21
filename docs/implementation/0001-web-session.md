# Web session

How `apps/app-next` signs users in and keeps them signed in. The product behavior is a unified passwordless flow: the user enters an email, receives a one-time code and is signed in, with an account created on first sign-in. This document fixes the technical rules.

## Sign-in code

- `actionSendCode` (`src/components/sign-in/action-send-code.ts`) creates one `Verification` row per request. The row id is the public code the browser keeps between the two steps; the six-digit code sent by email is stored as a SHA-256 hash and never leaves the server. What the row verifies is a JSON payload validated by `packages/lib/src/schemas/verification-payload.ts`, so another verification type (for example a reset email) only needs a new payload schema, not a database change.
- A code expires after 10 minutes, allows 5 attempts and is deleted by a successful verification, so it can only be used once.
- Emails are trimmed and lowercased before a code is created, so one address maps to one user.
- `DEV_VERIFICATION_PRIVATE_CODE` replaces the random code and skips the email in development, for every address or only for `DEV_TESTER_EMAILS`. The email module is loaded on demand, so the fixed code works without Postmark configured.
- The rules live in `src/lib/verification.ts`; the pure helpers (code generation, hashing, constant-time comparison) in `src/lib/crypto.ts`, with unit tests.

## Session

- `actionVerifyCode` upserts the user by email, creates a `Session` row and sets the `APP_SESSION` cookie. The cookie holds a random 32-byte token; the row id is the token's SHA-256, so a database leak does not expose usable cookies.
- The cookie is `httpOnly`, `sameSite=lax`, `path=/`, `secure` outside development, and expires together with the row after `SESSION_TTL_DAYS` (default 30).
- `getSession()` (`src/lib/session.ts`) reads the cookie, looks up the unexpired row and returns the session id with its user, or `undefined`. It is wrapped in React `cache`, so a layout, a page and its metadata share one lookup per request.
- Pages that need a user call `getSession()` and `redirect()` when it returns nothing. Access is enforced by the server-rendered pages, not by the proxy.
- `actionSignOut` deletes the row and clears the cookie, so a copied cookie stops working immediately.
- Cookies are only written in server actions; server components only read them. After a successful action, the client navigates with `router.replace` instead of calling `redirect()` inside the action.

## Boundaries

- Rate limiting and bot protection belong to the deployment layer (`docs/development/0000-overview/codebase-boundary.md`); the attempt limit above is the only brake in application code.
- Not implemented yet: sliding renewal, listing or revoking other sessions, sign-out from all devices.
