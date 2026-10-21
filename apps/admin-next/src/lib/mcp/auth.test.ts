import { describe, expect, it } from 'vitest'
import { authenticateRunner } from '@/lib/mcp/auth'

const secrets = { 'claude': 'claude-secret', 'local-worker': 'local-secret' }

describe('authenticateRunner', () => {
  it('identifies the runner whose secret matches the bearer token', () => {
    expect(authenticateRunner('Bearer claude-secret', secrets)).toBe('claude')
    expect(authenticateRunner('bearer local-secret', secrets)).toBe('local-worker')
  })

  it('rejects malformed, foreign and wrong headers', () => {
    expect(authenticateRunner(null, secrets)).toBeUndefined()
    expect(authenticateRunner('', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer ', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer claude-secret extra', secrets)).toBeUndefined()
    expect(authenticateRunner('Basic Y2xvdWQtc2VjcmV0', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer wrong', secrets)).toBeUndefined()
  })

  it('never matches an unconfigured or empty secret', () => {
    expect(authenticateRunner('Bearer undefined', { claude: undefined })).toBeUndefined()
    expect(authenticateRunner('Bearer ', { claude: '' })).toBeUndefined()
    expect(authenticateRunner('Bearer anything', {})).toBeUndefined()
  })
})
