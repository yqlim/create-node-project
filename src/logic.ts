import { AsyncLocalStorage } from 'node:async_hooks';

import { confirm } from '@inquirer/prompts';

import {
  CNPError,
  fsEntityExists,
  isDirectoryNodeProject,
  normalisePath,
} from './utils.js';

import type { parseArgs } from './args.js';

type CliContextStore = Awaited<ReturnType<typeof parseArgs>>;

export const cliContext = new AsyncLocalStorage<CliContextStore>();

export async function confirmDirectory(): Promise<void> {
  const { directory, existing, yes } = getCliArgs();
  const directoryExists = fsEntityExists(directory);

  if (!directoryExists) {
    return;
  }

  const shouldOverwrite: boolean =
    yes ||
    existing ||
    (await confirm({
      message: `Directory "${normalisePath(directory)}" already exists. Do you want to overwrite it?`,
      default: false,
    }));

  if (!shouldOverwrite) {
    throw new CNPError('Aborted');
  }

  const isExistingNodeProject = isDirectoryNodeProject(directory);

  if (!isExistingNodeProject) {
    throw new CNPError(
      `Directory ${normalisePath(directory)} is not a Node.js project`,
    );
  }
}

export function rejection(err: unknown): void {
  console.error(err instanceof CNPError ? err.message : err);
  process.exitCode = 1;
}

function getCliArgs(): CliContextStore {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cliContext.getStore()!;
}
