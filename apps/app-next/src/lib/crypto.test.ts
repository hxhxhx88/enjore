import { describe, expect, it } from 'vitest'
import { generateSessionToken, generateVerificationCode, hashSecret, secretMatches } from '@/lib/crypto'
import { codeLength } from '@/lib/verification'

describe('generateSessionToken', () => {
  it('returns a URL-safe token that differs each time', () => {
    const token = generateSessionToken()

    // 32 random bytes encode to 43 base64url characters.
    expect(token).toMatch(/^[\w-]{43}$/)
    expect(generateSessionToken()).not.toBe(token)
  })
})

describe('generateVerificationCode', () => {
  it('returns exactly the configured number of digits', () => {
    const codes = Array.from({ length: 100 }, () => generateVerificationCode())

    for (const code of codes) {
      expect(code).toHaveLength(codeLength)
      expect(code).toMatch(/^\d+$/)
    }
  })
})

describe('hashSecret', () => {
  it('is deterministic and does not contain the secret', () => {
    const hash = hashSecret('123456')

    expect(hash).toBe(hashSecret('123456'))
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hash).not.toContain('123456')
  })
})

describe('secretMatches', () => {
  it('accepts the hashed secret and rejects everything else', () => {
    const hash = hashSecret('123456')

    expect(secretMatches('123456', hash)).toBe(true)
    expect(secretMatches('654321', hash)).toBe(false)
    expect(secretMatches('123456', 'not-a-hash')).toBe(false)
  })
})
