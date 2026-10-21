import { env } from '@/lib/env'
import 'server-only'

interface SettingRow {
  name: string
  variables: string[]
  configured: boolean
}

function isSet(value: string | undefined): boolean {
  return value !== undefined && value !== ''
}

// "Settings" lists each integration and runner secret with the variables behind it and whether they are set. Every
// variable is mandatory for the app to boot, so the page is an inventory of what the deployment carries rather than a
// report of gaps; values never leave this module. Later milestones append their rows here.
export function readSettings(): SettingRow[] {
  return [
    { name: 'Database', variables: ['DATABASE_URL'], configured: isSet(env.DATABASE_URL) },
    {
      name: 'Basic Auth',
      variables: ['ADMIN_BASIC_AUTH_USERNAME', 'ADMIN_BASIC_AUTH_PASSWORD'],
      configured: isSet(env.ADMIN_BASIC_AUTH_USERNAME) && isSet(env.ADMIN_BASIC_AUTH_PASSWORD),
    },
    {
      name: 'Claude connector secret',
      variables: ['RUNNER_SECRET_CLAUDE'],
      configured: isSet(env.RUNNER_SECRET_CLAUDE),
    },
  ]
}
