# Email

The project uses [Postmark](https://postmarkapp.com) for email delivery. Ensure you have an account set up before continuing. The following environment variables are required:

- `EMAIL_SENDER`: The address used to deliver emails.
- `POSTMARK_API_KEY`: The Postmark API key.
- `POSTMARK_MESSAGE_STREAM`: The Postmark stream used to deliver emails. You can use the default `outbound` stream initially.

Delivery lives in `packages/email/src/lib/send.tsx`. In development, `DEV_VERIFICATION_PRIVATE_CODE` skips the sign-in email, so these variables can stay empty locally. Only `apps/app-next` sends email; the admin needs none of these variables.
