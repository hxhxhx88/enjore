import { Command } from 'commander'
import { actionExample } from './actions/example'

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

program.parse()
