import fs from 'node:fs';
import path from 'node:path';

import { InputsContext } from '../contexts/inputs.js';

export class CNPError extends Error {
  override readonly name = 'CreateNodeProjectError';
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
export async function resolveValue<T>(sources: {
  defaultValue: T;
  input: T | undefined;
  prompt(this: typeof sources): Promise<T>;
}): Promise<T> {
  if (typeof sources.input !== 'undefined') {
    return sources.input;
  }

  if (InputsContext.consume().get('yes')) {
    return sources.defaultValue;
  }

  return sources.prompt();
}
