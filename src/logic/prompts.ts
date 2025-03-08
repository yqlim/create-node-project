import path from 'node:path';

import { confirm, input, select } from '@inquirer/prompts';

import { argvContext as argv } from '../contexts/argv.js';
import {
  CNPError,
  fsEntityExists,
  isDirectoryNodeProject,
  isEmptyDirectory,
  normalisePath,
} from '../utils/index.js';

import type { ArgvStore } from '../contexts/argv.js';

type AnswerSource<T> = {
  defaultValue: NonNullable<T>;
  input: T | undefined;
  prompt(this: AnswerSource<T>): Promise<NonNullable<T>>;
};

type Questions = {
  [K in keyof ArgvStore]?: AnswerSource<ArgvStore[K]>;
};

export async function updateArgvWithPrompts(): Promise<void> {
  await confirmDirectory();

  if (!argv.get('directory')) {
    throw new CNPError('No directory provided');
  }

  const questions = createQuestions({
    manager: {
      defaultValue: 'pnpm',
      input: argv.get('manager'),
      prompt() {
        return select({
          message: 'What package manager do you want to use?',
          default: this.defaultValue,
          choices: ['npm', 'pnpm'],
        });
      },
    },
    name: {
      defaultValue: path.basename(argv.get('directory')!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
      input: argv.get('name'),
      prompt() {
        return input({
          message: 'What is the name of the package?',
          default: this.defaultValue,
        });
      },
    },
    description: {
      defaultValue: '',
      input: argv.get('description'),
      prompt() {
        return input({
          message: 'What is the description of the package?',
          default: this.defaultValue,
        });
      },
    },
    version: {
      defaultValue: '0.0.0',
      input: argv.get('version'),
      prompt() {
        return input({
          message: 'What is the version of the package?',
          default: this.defaultValue,
        });
      },
    },
    type: {
      defaultValue: 'module',
      input: argv.get('type'),
      prompt() {
        return select({
          message: 'What is the type of the package?',
          default: this.defaultValue,
          choices: ['module', 'commonjs'],
        });
      },
    },
    language: {
      defaultValue: 'ts',
      input: argv.get('language'),
      prompt() {
        return select({
          message: 'What language do you want to use?',
          default: this.defaultValue,
          choices: [
            {
              name: 'TypeScript',
              value: 'ts',
            },
            {
              name: 'JavaScript',
              value: 'js',
            },
          ],
        });
      },
    },
    publish: {
      defaultValue: 'private',
      input: argv.get('publish'),
      prompt() {
        return select({
          message: 'How do you plan to publish the package?',
          default: this.defaultValue,
          choices: [
            {
              name: 'Public',
              value: 'public',
            },
            {
              name: 'Private',
              value: 'private',
            },
          ],
        });
      },
    },
  });

  for (const [key, question] of Object.entries(questions)) {
    switch (key) {
      case 'existing':
      case 'yes':
        throw new Error('This should not happen');
      default:
        await updateArgv(key as keyof ArgvStore, question);
    }
  }

  if (argv.get('publish') === 'public') {
    await updateArgv('license', {
      defaultValue: 'MIT',
      input: argv.get('license'),
      prompt() {
        return input({
          message: 'What license do you want to use?',
          default: this.defaultValue,
        });
      },
    });
  }
}

async function confirmDirectory(): Promise<void> {
  await updateArgv('directory', {
    defaultValue: process.cwd(),
    input: argv.get('directory'),
    prompt() {
      return input({
        required: true,
        message: 'What is the directory of the package?',
        default: this.defaultValue,
        transformer(value, { isFinal }) {
          return isFinal ? normalisePath(value) : value;
        },
      });
    },
  });

  const directory = normalisePath(argv.get('directory')!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const directoryExists = fsEntityExists(directory);

  if (!directoryExists) {
    return;
  }

  if (isEmptyDirectory(directory)) {
    return;
  }

  const shouldOverwrite: boolean = await getAnswer({
    defaultValue: false,
    input: argv.get('existing'),
    prompt() {
      return confirm({
        message: `Directory "${directory}" already exists. Are you sure you want to make changes to it?`,
        default: this.defaultValue,
      });
    },
  });

  if (!shouldOverwrite) {
    throw new CNPError('Will not overwrite existing directory');
  }

  const isExistingNodeProject = isDirectoryNodeProject(directory);

  if (!isExistingNodeProject) {
    throw new CNPError(`Directory ${directory} is not a Node.js project`);
  }
}

/**
 * Just a convenience function to create the `Questions` object with type
 * safety.
 */
function createQuestions<const T extends Questions>(mapping: T): T {
  return mapping;
}

/**
 * A function to get the answer to a question by prioritizing appropriate answer
 * sources.
 */
function getAnswer<T>(options: AnswerSource<T>): T | Promise<T> {
  return (
    options.input ?? (argv.get('yes') ? options.defaultValue : options.prompt())
  );
}

async function updateArgv<K extends keyof ArgvStore>(
  key: K,
  answerSources: AnswerSource<ArgvStore[K]>,
): Promise<void> {
  argv.set(key, await getAnswer(answerSources));
}
