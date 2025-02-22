import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { Argv } from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferArgv<T extends (...args: any[]) => Argv | Promise<Argv>> = Awaited<
  ReturnType<T>
>;

export function init(): Promise<Argv> {
  const instance = yargs(hideBin(process.argv));

  instance.wrap(instance.terminalWidth());
  instance.alias('h', 'help');
  instance.alias('v', 'version');
  instance.strict();

  return Promise.resolve(instance);
}

export function setupCommands(instance: InferArgv<typeof init>) {
  return instance
    .command(
      '$0 [directory]',
      'Create a new Node.js project or bootstrap an existing one.',
    )
    .positional('directory', {
      type: 'string',
      describe: 'The target project directory.',
      default: process.cwd(),
    });
}

export function setupOptions(instance: InferArgv<typeof setupCommands>) {
  return instance.options({
    existing: {
      alias: ['e'],
      type: 'boolean',
      describe:
        'Make intention clear that you want to bootstrap an existing project. If this is not set and the `directory` already exists, the command will ask for confirmation.',
      default: false,
    },
    yes: {
      alias: ['y'],
      type: 'boolean',
      describe: 'Automatically say yes to all confirmation prompts.',
      default: false,
    },
  });
}

export function parseArgs(instance: InferArgv<typeof setupOptions>) {
  return instance.parse();
}
