import { Command } from 'commander'
import { actionExample } from './actions/example'
import { actionSeedAwards } from './actions/seed-awards'

const program = new Command()

program
  .name('cli')
  .description('Command line tools for the project')
  .version('0.0.0')

program
  .command('example')
  .description('Echo the given text')
  .option('-t, --text <text>', 'text to echo')
  .action(actionExample)

program
  .command('seed-awards')
  .description('Create or update the launch awards, their tiers and the translations of their names')
  .action(actionSeedAwards)

// A rejected action exits non-zero instead of ending as an unhandled rejection.
program.parseAsync().catch((e: unknown) => {
  console.error(e)
  process.exit(1)
})
