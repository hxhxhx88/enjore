import { Buffer } from 'node:buffer'
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'
import { codeLength } from '@/lib/verification'

// Random cookie token. Only its hash is stored, so a database leak does not expose usable cookies.
export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

// Cryptographically secure code with exactly `codeLength` digits.
export function generateVerificationCode(): string {
  return randomInt(10 ** (codeLength - 1), 10 ** codeLength).toString()
}

export function hashSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex')
}

// Compares in constant time, so response timing does not leak how much of the secret matched.
export function secretMatches(secret: string, secretHash: string): boolean {
  const expected = Buffer.from(secretHash, 'hex')
  const actual = Buffer.from(hashSecret(secret), 'hex')

  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
