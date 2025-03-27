import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { ContextManager } from '../helpers/context-manager/index.js';

export type InputsStore = {
  description: string | undefined;
  directory: string | undefined;
  // license: string[] | undefined;
  name: string | undefined;
  // manager: 'npm' | 'pnpm' | undefined;
  // publish: 'private' | 'public' | undefined;
  // script: 'ts' | 'js' | undefined;
  // type: 'module' | 'commonjs' | undefined;
  // version: string | undefined;
  // yes: boolean;
  _: (string | number)[];
  $0: string;
};

export class InputsContext extends ContextManager<InputsStore> {
  static #instance: InputsContext | undefined = undefined;

  static #getInstance(): InputsContext {
    if (!InputsContext.#instance) {
      const yargsInst = yargs(hideBin(process.argv));
      const rawInputs = yargsInst
        .wrap(yargsInst.terminalWidth())
        .alias('h', 'help')
        .version(false)
        .strict()
        .command(
          '$0 [directory]',
          'Create a new Node.js project with opinionated bootstrap.',
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
          // license: {
          //   alias: ['l'],
          //   array: true,
          //   type: 'string',
          //   describe:
          //     'The license to use for the project. If the project is public, defaults to "MIT".',
          // },
          name: {
            alias: ['n'],
            type: 'string',
            describe:
              'The name of the project. Defaults to the target directory name',
          },
          // manager: {
          //   alias: ['m'],
          //   type: 'string',
          //   describe: 'The package manager to use for the project.',
          //   choices: ['npm', 'pnpm'] as const,
          // },
          // publish: {
          //   alias: ['p'],
          //   type: 'string',
          //   describe: 'Create a public project.',
          //   choices: ['private', 'public'] as const,
          // },
          // script: {
          //   alias: ['s'],
          //   type: 'string',
          //   describe: 'The language to use for the project.',
          //   choices: ['ts', 'js'] as const,
          // },
          // type: {
          //   alias: ['t'],
          //   type: 'string',
          //   describe: 'The type of project to create.',
          //   choices: ['module', 'commonjs'] as const,
          // },
          // version: {
          //   alias: ['v'],
          //   type: 'string',
          //   describe: 'The version of the project.',
          // },
          // yes: {
          //   alias: ['y'],
          //   type: 'boolean',
          //   describe: 'Skip all prompts and use defaults.',
          //   default: false,
          // },
        })
        .parseSync();

      InputsContext.#instance = new InputsContext(rawInputs);
    }

    return InputsContext.#instance;
  }

  static consume(): InputsContext {
    if (!this.#instance) {
      throw new Error('No instance is available in the current context.');
    }
    return this.#instance;
  }

  static provide<R, A extends unknown[]>(fn: (...args: A) => R, ...args: A): R {
    return this.#getInstance().provide(fn, ...args);
  }
}

export default InputsContext;
