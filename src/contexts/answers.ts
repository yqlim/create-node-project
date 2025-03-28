import path from 'node:path';

import {
  input,
  // select,
  search,
} from '@inquirer/prompts';

import { ContextManager } from '../helpers/context-manager/index.js';
import {
  CNPError,
  isDirectory,
  isDirectoryEmpty,
  isPathExist,
  normalisePath,
  resolveValue,
} from '../utils/index.js';
import { getTemplateList } from '../utils/templating.js';
import { InputsContext } from './inputs.js';

import type { RequiredDeep } from 'type-fest';
import type { InputsStore } from './inputs.js';

export type AnswerStore = RequiredDeep<Omit<InputsStore, '_' | '$0'>>;

export class AnswerContext extends ContextManager<AnswerStore> {
  static #instance: AnswerContext | undefined = undefined;

  static async #getInstance(): Promise<AnswerContext> {
    if (!AnswerContext.#instance) {
      const inputs = InputsContext.consume();

      const directory = normalisePath(
        await resolveValue({
          defaultValue: process.cwd(),
          input: inputs.get('directory'),
          prompt() {
            return input({
              required: true,
              message: 'What is the directory of the package?',
              default: this.defaultValue,
            });
          },
        }),
      );

      if (isPathExist(directory)) {
        if (isDirectory(directory)) {
          if (!isDirectoryEmpty(directory)) {
            throw new CNPError(
              'The target pathname already exists and is not empty',
            );
          }
        } else {
          throw new CNPError(
            'The target pathname already exists and is not an empty directory',
          );
        }
      }

      const templateList = getTemplateList();
      const template = await resolveValue({
        defaultValue: 'default',
        input: inputs.get('template'),
        prompt() {
          return search({
            message: 'What template do you want to use?',
            source(term) {
              return templateList.filter((name) =>
                term ? new RegExp(term).test(name) : true,
              );
            },
            validate(value) {
              return templateList.includes(value);
            },
          });
        },
      });

      if (!templateList.includes(template)) {
        throw new CNPError('The provided template is not valid.');
      }

      const store: AnswerStore = {
        // yes: inputs.get('yes'),
        directory,
        // manager: await resolveValue({
        //   defaultValue: 'pnpm',
        //   input: inputs.get('manager'),
        //   prompt() {
        //     return select({
        //       message: 'What package manager do you want to use?',
        //       default: this.defaultValue,
        //       choices: ['npm', 'pnpm'],
        //     });
        //   },
        // }),
        template,
        name: await resolveValue({
          defaultValue: path.basename(directory),
          input: inputs.get('name'),
          prompt() {
            return input({
              message: 'What is the name of the package?',
              default: this.defaultValue,
            });
          },
        }),
        description: await resolveValue({
          defaultValue: '',
          input: inputs.get('description'),
          prompt() {
            return input({
              message: 'What is the description of the package?',
              default: this.defaultValue,
            });
          },
        }),
        // version: await resolveValue({
        //   defaultValue: '0.1.0',
        //   input: inputs.get('version'),
        //   prompt() {
        //     return input({
        //       message: 'What is the version of the package?',
        //       default: this.defaultValue,
        //     });
        //   },
        // }),
        // type: await resolveValue({
        //   defaultValue: 'module',
        //   input: inputs.get('type'),
        //   prompt() {
        //     return select({
        //       message: 'What is the type of the package?',
        //       default: this.defaultValue,
        //       choices: ['module', 'commonjs'],
        //     });
        //   },
        // }),
        // script: await resolveValue({
        //   defaultValue: 'ts',
        //   input: inputs.get('script'),
        //   prompt() {
        //     return select({
        //       message: 'What language do you want to use?',
        //       default: this.defaultValue,
        //       choices: [
        //         {
        //           name: 'TypeScript',
        //           value: 'ts',
        //         },
        //         {
        //           name: 'JavaScript',
        //           value: 'js',
        //         },
        //       ],
        //     });
        //   },
        // }),
        // publish: await resolveValue({
        //   defaultValue: 'private',
        //   input: inputs.get('publish'),
        //   prompt() {
        //     return select({
        //       message: 'What is the visibility of the package?',
        //       default: this.defaultValue,
        //       choices: [
        //         {
        //           name: 'Public',
        //           value: 'public',
        //         },
        //         {
        //           name: 'Private',
        //           value: 'private',
        //         },
        //       ],
        //     });
        //   },
        // }),
        // license: inputs.get('license') ?? [],
      };

      // if (store.publish === 'public') {
      //   store.license = await resolveValue({
      //     defaultValue: ['MIT'],
      //     input: inputs.get('license'),
      //     async prompt() {
      //       const value = await input({
      //         message:
      //           'What is the license of the package? If you have multiple licenses, separate them with commas.',
      //         default: this.defaultValue.join(','),
      //       });
      //       return value.split(',').map((license) => license.trim());
      //     },
      //   });
      // }

      AnswerContext.#instance = new AnswerContext(store);
    }

    return AnswerContext.#instance;
  }

  static consume(): AnswerContext {
    if (!this.#instance) {
      throw new Error('No instance is available in the current context.');
    }
    return this.#instance;
  }

  static provide<R, A extends unknown[]>(
    fn: (...args: A) => R,
    ...args: A
  ): Promise<R> {
    return this.#getInstance().then(
      (instance) => instance.provide(fn, ...args),
      (error: unknown) => {
        if (error instanceof Error && error.name === 'ExitPromptError') {
          console.error('\nAborted\n');
          process.exit(0);
        } else {
          throw error;
        }
      },
    );
  }
}

export default AnswerContext;
