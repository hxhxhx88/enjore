import { describe, expect, it } from 'vitest'
import { parseAllowedHosts, resolveDatabaseUrl } from './database-switch'

const defaultUrl = 'postgresql://app:secret@db.internal/app'

describe('parseAllowedHosts', () => {
  it('splits, trims, lowercases and drops empty entries', () => {
    expect(parseAllowedHosts(' LocalHost , *.neon.tech ,, ')).toEqual(['localhost', '*.neon.tech'])
  })

  it('returns no hosts when the variable is unset or empty', () => {
    expect(parseAllowedHosts(undefined)).toEqual([])
    expect(parseAllowedHosts('')).toEqual([])
  })
})

describe('resolveDatabaseUrl', () => {
  it('uses the default when nothing is requested', () => {
    expect(resolveDatabaseUrl({ requestedUrl: undefined, defaultUrl, allowedHosts: ['localhost'] })).toBe(defaultUrl)
    expect(resolveDatabaseUrl({ requestedUrl: '', defaultUrl, allowedHosts: ['localhost'] })).toBe(defaultUrl)
  })

  it('accepts an allowed host', () => {
    const requestedUrl = 'postgres://tester:pw@LOCALHOST:5432/case-1'

    expect(resolveDatabaseUrl({ requestedUrl, defaultUrl, allowedHosts: ['localhost'] })).toBe(requestedUrl)
  })

  it('matches subdomains of a wildcard entry only', () => {
    const allowedHosts = ['*.neon.tech']
    const requestedUrl = 'postgresql://tester:pw@ep-cool-name.eu-central-1.aws.neon.tech/testdb?sslmode=require'

    expect(resolveDatabaseUrl({ requestedUrl, defaultUrl, allowedHosts })).toBe(requestedUrl)
    expect(() => resolveDatabaseUrl({ requestedUrl: 'postgres://u:p@neon.tech/db', defaultUrl, allowedHosts })).toThrow(/not listed/)
    expect(() => resolveDatabaseUrl({ requestedUrl: 'postgres://u:p@evilneon.tech/db', defaultUrl, allowedHosts })).toThrow(/not listed/)
    expect(() => resolveDatabaseUrl({ requestedUrl: 'postgres://u:p@x.neon.tech.evil.com/db', defaultUrl, allowedHosts })).toThrow(/not listed/)
  })

  it('rejects every host when the allowlist is empty', () => {
    expect(() => resolveDatabaseUrl({ requestedUrl: 'postgres://u:p@localhost/db', defaultUrl, allowedHosts: [] })).toThrow(/not listed/)
  })

  it('rejects other protocols and malformed URLs', () => {
    expect(() => resolveDatabaseUrl({ requestedUrl: 'mysql://u:p@localhost/db', defaultUrl, allowedHosts: ['localhost'] })).toThrow(/PostgreSQL/)
    expect(() => resolveDatabaseUrl({ requestedUrl: 'not a url', defaultUrl, allowedHosts: ['localhost'] })).toThrow(/valid URL/)
  })

  it('never puts credentials into the error message', () => {
    let message = ''
    try {
      resolveDatabaseUrl({ requestedUrl: 'postgres://user:hunter2@evil.example/db', defaultUrl, allowedHosts: [] })
    }
    catch (e) {
      message = e instanceof Error ? e.message : ''
    }

    expect(message).toContain('evil.example')
    expect(message).not.toContain('hunter2')
  })
})
