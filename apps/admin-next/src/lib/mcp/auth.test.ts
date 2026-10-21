import { describe, expect, it } from 'vitest'
import { authenticateRunner } from '@/lib/mcp/auth'

const secrets = { 'cloud-task': 'cloud-secret', 'local-worker': 'local-secret' }

describe('authenticateRunner', () => {
  it('identifies the runner whose secret matches the bearer token', () => {
    expect(authenticateRunner('Bearer cloud-secret', secrets)).toBe('cloud-task')
    expect(authenticateRunner('bearer local-secret', secrets)).toBe('local-worker')
  })

  it('rejects malformed, foreign and wrong headers', () => {
    expect(authenticateRunner(null, secrets)).toBeUndefined()
    expect(authenticateRunner('', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer ', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer cloud-secret extra', secrets)).toBeUndefined()
    expect(authenticateRunner('Basic Y2xvdWQtc2VjcmV0', secrets)).toBeUndefined()
    expect(authenticateRunner('Bearer wrong', secrets)).toBeUndefined()
  })

  it('never matches an unconfigured or empty secret', () => {
    expect(authenticateRunner('Bearer undefined', { 'cloud-task': undefined })).toBeUndefined()
    expect(authenticateRunner('Bearer ', { 'cloud-task': '' })).toBeUndefined()
    expect(authenticateRunner('Bearer anything', {})).toBeUndefined()
  })
})
