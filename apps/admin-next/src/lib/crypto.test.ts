import { describe, expect, it } from 'vitest'
import { secureEquals } from '@/lib/crypto'

describe('secureEquals', () => {
  it('accepts equal strings and rejects every difference', () => {
    expect(secureEquals('secret', 'secret')).toBe(true)
    expect(secureEquals('', '')).toBe(true)
    expect(secureEquals('secret', 'Secret')).toBe(false)
    expect(secureEquals('secret', 'secret ')).toBe(false)
    expect(secureEquals('secret', '')).toBe(false)
  })
})
