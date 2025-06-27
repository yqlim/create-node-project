import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import AnswerContext from '../contexts/answers.js';
import { InputsContext } from '../contexts/inputs.js';

const PROJECT_ROOT_MEMO = new Map<string, string>();

export class CNPError extends Error {
  override readonly name = 'CreateNodeProjectError';
}

/**
 * Capitalise the first letter of a word.
 */
export function capitalise<T extends string>(word: T): Capitalize<T> {
  return word.charAt(0).toUpperCase().concat(word.slice(1)) as Capitalize<T>;
}

/**
 * Copy all files including subdirectories from a source directory to a
 * destination directory.
 */
export function copyDirectory(
  source: string,
  destination: string,
  ignores: string[] = [
    '.git',
    'build',
    'dist',
    'node_modules',
    'out',
    'pnpm-lock.yaml',
    'yarn.lock',
    'package-lock.json',
  ],
): Promise<void> {
  const sep = escapeStringRegex(path.sep);
  const ignored = ignores.map(escapeStringRegex).join('|');
  const regex = new RegExp(`${sep}(?:${ignored})(?:${sep}.*)?$`);
  return fs.promises.cp(source, destination, {
    errorOnExist: true,
    recursive: true,
    filter: (src) => !regex.test(src),
  });
}

/**
 * Escapes a string to be parsed as regular expression.
 *
 * @example
 *
 * ```js
 * const example = 'A.B.C.D';
 * const target = '.';
 * const intendedResult = 'A-B-C-D';
 *
 * const withoutEscape = new RegExp(target, 'g');
 * const withEscape = new RegExp(escapeStringRegex(target), 'g');
 *
 * assert.strictEqual(example.replace(withEscape, '-'), intendedResult); // ok
 * assert.strictEqual(example.replace(withoutEscape, '-'), intendedResult); // not ok
 * ```
 */
export function escapeStringRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Get the root directory of a Node.js project.
 */
export function getProjectRoot(
  from: string,
  indicatorFiles: string[] = ['package-lock.json', 'pnpm-lock.yaml'],
  memo: string[] = [],
): string {
  if (!PROJECT_ROOT_MEMO.has(from)) {
    memo.push(from);

    const dirent = fs.readdirSync(from, { withFileTypes: true });
    const hasIndicatorFile = dirent.some((entity) => {
      return indicatorFiles.includes(entity.name);
    });

    if (!hasIndicatorFile) {
      if (from === '/') {
        throw new Error('Failed to find the root of the Node.js project');
      }
      return getProjectRoot(path.dirname(from), indicatorFiles, memo);
    }

    memo.forEach((pathname) => {
      PROJECT_ROOT_MEMO.set(pathname, from);
    });
  }

  return PROJECT_ROOT_MEMO.get(from)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

/**
 * Detect if a provided pathname is a directory.
 */
export function isDirectory(pathname: string): boolean {
  const entity = fs.statSync(normalisePath(pathname), {
    throwIfNoEntry: false,
  });
  return entity?.isDirectory() ?? false;
}

/**
 * Detect if a provided directory is empty.
 */
export function isDirectoryEmpty(directory: string): boolean {
  const dirname = normalisePath(directory);
  const entities = fs.readdirSync(dirname, { withFileTypes: true });
  return entities.length === 0;
}

/**
 * Detect if a provided pathname is a Node.js project.
 */
export function isDirectoryNodeProject(directory: string): boolean {
  const dirname = normalisePath(directory);
  const indicatorFile = path.resolve(dirname, 'package.json');
  return isPathExist(indicatorFile);
}

/**
 * Detect if a provided pathname exists.
 */
export function isPathExist(pathname: string): boolean {
  return fs.existsSync(normalisePath(pathname));
}

/**
 * Normalise a provided pathname.
 */
export function normalisePath(pathname: string): string {
  return path.isAbsolute(pathname)
    ? pathname
    : path.resolve(process.cwd(), pathname);
}

/**
 * Mechanism to choose a value from multiple sources using the following
 * priority order:
 *
 * 1. Value from user input.
 * 2. Default value (only if the `yes` flag is set).
 * 3. Prompt the user for the value.
 */
export async function resolveValue<T extends string>(sources: {
  defaultValue: T;
  input: T | undefined;
  prompt(this: typeof sources): Promise<T>;
}): Promise<T> {
  if (typeof sources.input !== 'undefined') {
    return sources.input;
  }

  // @ts-expect-error The `yes` flag is temporarily disabled
  if (InputsContext.consume().get('yes')) {
    return sources.defaultValue;
  }

  return sources.prompt();
}

/**
 * Run a command as a child process where the `cwd` is the directory from
 * `AnswerContext` and the `stdio` is inherited.
 */
export function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log('Executing command: %s', [command, ...args].join(' '));

    const child = spawn(command, args, {
      cwd: AnswerContext.consume().get('directory'),
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new CNPError(`Failed to execute command: ${command}`));
      }
    });
  }).finally(() => {
    // Add an empty line after the command output
    console.log('');
  });
}
