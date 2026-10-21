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

// "Settings" reports whether each integration and runner secret is configured, from the presence of its variables.
// Values never leave this module. The first rows are mandatory for the app to boot and are listed for completeness, so
// the page covers every integration. Later milestones append their rows here.
export function readSettings(): SettingRow[] {
  return [
    { name: 'Database', variables: ['DATABASE_URL'], configured: isSet(env.DATABASE_URL) },
    {
      name: 'Basic Auth',
      variables: ['ADMIN_BASIC_AUTH_USERNAME', 'ADMIN_BASIC_AUTH_PASSWORD'],
      configured: isSet(env.ADMIN_BASIC_AUTH_USERNAME) && isSet(env.ADMIN_BASIC_AUTH_PASSWORD),
    },
    {
      name: 'Cloud task runner secret',
      variables: ['RUNNER_SECRET_CLOUD_TASK'],
      configured: isSet(env.RUNNER_SECRET_CLOUD_TASK),
    },
  ]
}
