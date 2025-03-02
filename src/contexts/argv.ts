import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ContextManager } from '../helpers/context-manager/index.js';

export type ArgvStore = {
  description: string | undefined;
  directory: string | undefined;
  existing: boolean | undefined;
  language: 'ts' | 'js' | undefined;
  license: string | undefined;
  name: string | undefined;
  manager: 'npm' | 'pnpm' | undefined;
  public: boolean | undefined;
  type: 'module' | 'commonjs' | undefined;
  version: string | undefined;
  yes: boolean;
  _: (string | number)[];
  $0: string;
};

const instance = yargs(hideBin(process.argv));
const argv = instance
  .wrap(instance.terminalWidth())
  .alias('h', 'help')
  .version(false)
  .strict()
  .command(
    '$0 [directory]',
    'Create a new Node.js project or bootstrap an existing one.',
  )
  .positional('directory', {
    type: 'string',
    describe: 'The target project directory.',
  })
  .options({
    description: {
      alias: ['d', 'desc'],
      type: 'string',
      describe: 'The description of the project.',
    },
    existing: {
      alias: ['e'],
      type: 'boolean',
      describe:
        'Make intention clear that you want to bootstrap an existing project. If this is not set and the `directory` already exists, the command will ask for confirmation.',
    },
    language: {
      alias: ['l', 'lang'],
      type: 'string',
      describe: 'The language to use for the project.',
      choices: ['ts', 'js'] as const,
    },
    license: {
      alias: [],
      type: 'string',
      describe:
        'The license to use for the project. If the project is public, defaults to "MIT".',
    },
    name: {
      alias: ['n'],
      type: 'string',
      describe:
        'The name of the project. Defaults to the target directory name',
    },
    manager: {
      alias: ['m'],
      type: 'string',
      describe: 'The package manager to use for the project.',
      choices: ['npm', 'pnpm'] as const,
    },
    public: {
      alias: ['p'],
      type: 'boolean',
      describe: 'Create a public project.',
    },
    type: {
      alias: ['t'],
      type: 'string',
      describe: 'The type of project to create.',
      choices: ['module', 'commonjs'] as const,
    },
    version: {
      alias: ['v'],
      type: 'string',
      describe: 'The version of the project.',
    },
    yes: {
      alias: ['y'],
      type: 'boolean',
      describe: 'Skip all prompts and use defaults.',
      default: false,
    },
  })
  .parseSync();

export const argvContext = new ContextManager<ArgvStore>(argv);
