import type { Runner } from '@repo/lib/schemas/runner'
import { runners } from '@repo/lib/schemas/runner'
import { secureEquals } from '@/lib/crypto'

// The secrets configured in the environment, by runner. `| undefined` because of `exactOptionalPropertyTypes`.
type RunnerSecrets = Readonly<Partial<Record<Runner, string | undefined>>>

// Identifies the runner behind `Authorization: Bearer <token>`, or undefined when no configured secret matches. Every
// configured secret is compared, so the timing does not reveal which runner a token was close to.
export function authenticateRunner(authorization: string | null, secrets: RunnerSecrets): Runner | undefined {
  const parts = (authorization ?? '').split(' ')
  const [scheme, token] = parts
  if (parts.length !== 2 || scheme?.toLowerCase() !== 'bearer' || token === undefined || token === '') {
    return undefined
  }

  let matched: Runner | undefined
  for (const runner of runners) {
    const secret = secrets[runner]
    if (secret !== undefined && secret !== '' && secureEquals(token, secret)) {
      matched ??= runner
    }
  }
  return matched
}
