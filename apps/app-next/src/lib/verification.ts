// Rules of the email sign-in code. Shared by the server actions and the client forms, so this module stays free of
// server-only imports.
export const codeLength = 6
export const verificationTtlMinutes = 10
export const maxVerificationAttempts = 5
export const resendCooldownSeconds = 60
